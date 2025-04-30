module.exports = {
  // ...existing code...
  plugins: ["@typescript-eslint"], // Asegúrate de incluir el plugin
  rules: {
    // ...existing rules...
    "@typescript-eslint/no-unused-expressions": "off", // Desactiva la regla
  },
};