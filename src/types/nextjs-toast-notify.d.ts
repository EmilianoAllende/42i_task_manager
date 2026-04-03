declare module 'nextjs-toast-notify' {
  export const showToast: {
    success: (msg: string, opts?: any) => void;
    error: (msg: string, opts?: any) => void;
    info: (msg: string, opts?: any) => void;
    warning: (msg: string, opts?: any) => void;
  };
}
