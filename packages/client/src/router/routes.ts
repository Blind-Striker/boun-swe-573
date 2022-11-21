class VaultRoutes {
  private constructor(
    public readonly path: string,
    public readonly meta?: RouteMeta
  ) {}

  public static HOME: VaultRoutes = {
    path: "/",
    meta: {
      public: true, // Allow access to even if not logged in
      onlyWhenLoggedOut: true,
    },
  };

  public static SIGNIN: VaultRoutes = {
    path: "/signin",
    meta: {
      public: true, // Allow access to even if not logged in
      onlyWhenLoggedOut: true,
    },
  };

  public static SIGNUP: VaultRoutes = {
    path: "/about",
  };

  public static ABOUT: VaultRoutes = {
    path: "/about",
  };

  static loadView(view: string) {
    return () =>
      import(/* webpackChunkName: "view-[request]" */ `../views/${view}.vue`);
  }
}

export default VaultRoutes;

type RouteMeta = {
  public: boolean;
  onlyWhenLoggedOut: boolean;
};
