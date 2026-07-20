/**
 * PocketBase Authentication Middleware
 * 
 * Verifies PocketBase tokens for API routes and server-side operations.
 * 
 * Usage:
 *   import { verifyPocketBaseToken, withAuth } from '@/lib/pocketbase-auth';
 *   
 *   // In API routes
 *   export async function GET(request: NextRequest) {
 *     const user = await verifyPocketBaseToken(request);
 *     if (!user) {
 *       return errorResponse(['Unauthorized'], 401);
 *     }
 *     // ... authenticated logic
 *   }
 *   
 *   // Or use the withAuth wrapper
 *   export const GET = withAuth(async (request, user) => {
 *     // user is guaranteed to exist
 *     return successResponse({ userId: user.id });
 *   });
 */

import { NextRequest, NextResponse } from 'next/server';
import { pb } from '@/lib/pocketbase';
import type { UserRecord } from '@/types/pocketbase';

// ==================== TYPES ====================

export interface AuthContext {
  user: UserRecord;
  token: string;
}

export type AuthenticatedHandler = (
  request: NextRequest,
  context: AuthContext
) => Promise<NextResponse>;

// ==================== TOKEN VERIFICATION ====================

/**
 * Verify a PocketBase token and return the user record
 */
export async function verifyPocketBaseToken(
  tokenOrRequest: string | NextRequest
): Promise<UserRecord | null> {
  try {
    let token: string;

    if (typeof tokenOrRequest === 'string') {
      token = tokenOrRequest;
    } else {
      const authHeader = tokenOrRequest.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return null;
      }
      token = authHeader.substring(7);
    }

    if (!token) {
      return null;
    }

    // Save token and refresh to verify
    pb.authStore.save(token);
    const authData = await pb.collection('users').authRefresh();

    return authData.record as unknown as UserRecord;
  } catch (error) {
    console.error('Token verification failed:', error);
    pb.authStore.clear();
    return null;
  }
}

/**
 * Verify token and return auth context
 */
export async function getAuthContext(
  tokenOrRequest: string | NextRequest
): Promise<AuthContext | null> {
  try {
    let token: string;

    if (typeof tokenOrRequest === 'string') {
      token = tokenOrRequest;
    } else {
      const authHeader = tokenOrRequest.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return null;
      }
      token = authHeader.substring(7);
    }

    if (!token) {
      return null;
    }

    // Save token and refresh to verify
    pb.authStore.save(token);
    const authData = await pb.collection('users').authRefresh();

    return {
      user: authData.record as unknown as UserRecord,
      token,
    };
  } catch (error) {
    console.error('Auth context creation failed:', error);
    pb.authStore.clear();
    return null;
  }
}

// ==================== AUTH WRAPPER ====================

/**
 * Wrap an API handler with authentication
 * 
 * @example
 * ```typescript
 * export const GET = withAuth(async (request, { user }) => {
 *   return NextResponse.json({ userId: user.id });
 * });
 * ```
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authContext = await getAuthContext(request);

    if (!authContext) {
      return NextResponse.json(
        {
          status: 'error',
          data: null,
          errors: ['Unauthorized. Please log in.'],
          requestId: crypto.randomUUID(),
        },
        { status: 401 }
      );
    }

    return handler(request, authContext);
  };
}

/**
 * Wrap an API handler with optional authentication
 * 
 * @example
 * ```typescript
 * export const GET = withOptionalAuth(async (request, auth) => {
 *   if (auth) {
 *     // User is authenticated
 *   } else {
 *     // Anonymous access
 *   }
 * });
 * ```
 */
export function withOptionalAuth(
  handler: (
    request: NextRequest,
    auth: AuthContext | null
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authContext = await getAuthContext(request);
    return handler(request, authContext);
  };
}

// ==================== ROLE CHECKING ====================

/**
 * Check if user has required role
 */
export function hasRole(
  user: UserRecord,
  requiredRoles: UserRecord['role'][]
): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if user is admin or owner
 */
export function isAdmin(user: UserRecord): boolean {
  return user.role === 'OWNER' || user.role === 'ADMIN';
}

/**
 * Check if user is owner
 */
export function isOwner(user: UserRecord): boolean {
  return user.role === 'OWNER';
}

/**
 * Check if user is at least manager
 */
export function isManagerOrAbove(user: UserRecord): boolean {
  return ['OWNER', 'ADMIN', 'MANAGER'].includes(user.role);
}

// ==================== ORGANIZATION ACCESS ====================

/**
 * Check if user has access to organization
 */
export async function hasOrgAccess(
  userId: string,
  orgId: string
): Promise<boolean> {
  try {
    const membership = await pb.collection('org_members').getFirstListItem(
      `userId = "${userId}" && organizationId = "${orgId}" && status = "ACTIVE"`
    );
    return !!membership;
  } catch {
    return false;
  }
}

/**
 * Get user's organization membership
 */
export async function getOrgMembership(userId: string, orgId: string) {
  try {
    return await pb.collection('org_members').getFirstListItem(
      `userId = "${userId}" && organizationId = "${orgId}"`
    );
  } catch {
    return null;
  }
}

// ==================== ERROR RESPONSES ====================

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    {
      status: 'error',
      data: null,
      errors: [message],
      requestId: crypto.randomUUID(),
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    {
      status: 'error',
      data: null,
      errors: [message],
      requestId: crypto.randomUUID(),
    },
    { status: 403 }
  );
}
