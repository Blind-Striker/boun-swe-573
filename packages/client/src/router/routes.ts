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
    path: "/signup",
    meta: {
      public: true,
      onlyWhenLoggedOut: false,
    },
  };

  public static ADDCONTENT: VaultRoutes = {
    path: "/addcontent",
    meta: {
      public: true,
      onlyWhenLoggedOut: false,
    },
  };

  public static LISTCONTENT: VaultRoutes = {
    path: "/listcontent",
    meta: {
      public: true,
      onlyWhenLoggedOut: false,
    },
  };

  public static ABOUT: VaultRoutes = {
    path: "/about",
    meta: {
      public: false,
      onlyWhenLoggedOut: false,
    },
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
