<template>
  <div id="app">
    <vs-button @click="generatePDF()" >Generar PDF</vs-button>

    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1000"
      filename="nightprogrammerpdf"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      :pdf-margin="0"
      pdf-orientation="landscape"
      pdf-content-width="1150px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <ContentToPrint />
      </section>
    </vue-html2pdf>
    <div>
      <ContentToPrint />
    </div>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import ContentToPrint from "./contenido_certificado";

export default {
  name: "App",
  methods: {
    hasGenerated() {
      alert("PDF generated successfully!");
    },
    generatePDF() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  components: {
    VueHtml2pdf,
    ContentToPrint,
  },
};
</script>