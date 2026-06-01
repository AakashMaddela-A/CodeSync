export const CODE_TEMPLATES = {
  javascript: `function hello() {
  console.log("Hello World");
}

hello();`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
};

export const getTemplate = (language) => {
  return CODE_TEMPLATES[language] || CODE_TEMPLATES.javascript;
};
