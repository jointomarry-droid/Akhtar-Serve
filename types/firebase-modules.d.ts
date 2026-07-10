/* eslint-disable @typescript-eslint/no-explicit-any */
// Firebase module declarations to fix type resolution
// Firebase v11 has broken typings paths

declare module "firebase/auth" {
  export * from "@firebase/auth";
}

declare module "firebase/firestore" {
  export * from "@firebase/firestore";
}

declare module "firebase/storage" {
  export * from "@firebase/storage";
}

declare module "firebase/analytics" {
  export * from "@firebase/analytics";
}

declare module "firebase/app" {
  export * from "@firebase/app";
}
