interface ImportMetaEnv {
    readonly VITE_API_URL: string; // Добавьте здесь все ваши переменные окружения
    // Добавьте другие переменные, если они есть
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }