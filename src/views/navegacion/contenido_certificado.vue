<template>
  <div align="center" style="font-family:'Times New Roman', Times, serif">
      <img src="https://scontent.fuio22-1.fna.fbcdn.net/v/t39.30808-6/294370882_5165324703522978_4172668896117532347_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeH2Lm5FsshHPgnEnNEe30bPmymlpk00FEmbKaWmTTQUSdk8YRkW_Kp7uySdCEOdnThNlyY4UuH1HAii8D6J4liS&_nc_ohc=0eaLQTqE8vsAX-B8HFC&_nc_ht=scontent.fuio22-1.fna&oh=00_AT_tO7_0VclfZ_byrr676BaMNevQQa9Widdtea3VPWvy6g&oe=62DAB0C7" alt="" style="height:100%; width:100%;">
      <div style="font-size: 30px; position: relative; color: #4B4B4B; top: -500px; right: -220px;">
        {{usuario[0].nombres}} {{usuario[0].apellidos}}
      </div>

      <div style="font-size: 23px; position: relative; color: #4B4B4B; top: -425px; right: -225px;">
        {{curso_certificado}}
      </div>

      <div style="font-size: 20px; position: relative; color: #4B4B4B; top: -410px; right: -190px;">
        {{cant_horas}} horas
      </div>

      <div style="font-size: 15px; position: relative; color: #4B4B4B; top: -336px; right: -290px;">
        {{fecha_actual}}
      </div>

  </div>
</template>

<script>
export default {
    components: {
      
    },
    data() {
      return {
        usuario: [],
        curso_certificado: '',
        cant_horas: '',
        fecha_actual: '',
      };
    },
    created() {

    },
    mounted() {
      this.fechaLarga()
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.curso_certificado = localStorage.getItem("curso_certificado");
      this.cant_horas = localStorage.getItem("cant_horas");
    },
    methods: {
      fechaLarga() {
        var d = new Date();
        var dia = new Array(7);
        dia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        let hora = d.getHours()
        let minuto = d.getMinutes()
        let hhora = '';
        let mminuto = '';
        if (hora < 10) {
            hhora = `0${hora}`
        } else {
            hhora = `${hora}`
        }
        if (minuto < 10) {
            mminuto = `0${minuto}`
        } else {
            mminuto = `${minuto}`
        }
        var mesok = new Array(12);
        mesok = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        this.fecha_actual = dia[d.getDay()] + " " + d.getDate() + " de " + mesok[(d.getMonth())] + " del " + d.getFullYear();
      },
  },
};
</script>
