import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (
      options: {
        head?: string[][];
        body?: any[][];
        startY?: number;
      }
    ) => jsPDF;
  }
}
