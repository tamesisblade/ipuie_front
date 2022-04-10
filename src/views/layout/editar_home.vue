<template>
<div class="p-8">
    <vs-popup title="Carrusel" :active.sync="popupCarrusel">
        <div>

            <vs-input label="Título" v-model="carrusel.titulo" class="w-full mb-4" />
            <vs-input label="Descripción" v-model="carrusel.descripcion" class="w-full mb-4" />
            <vs-input label="Texto" v-model="carrusel.texto" class="w-full mb-4" />
            <vs-input label="Color" v-model="carrusel.color" class="w-full mb-4" />
            <vs-input label="Color de los textos" v-model="carrusel.color_texto" class="w-full mb-4" />
            <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de carrusel</div>
            <input type="file" name="file1" id="file1" class="w-full inputfile mb-base">

            <vs-button type="gradient" color="primary" style="float: right;"  @click="popupCarrusel=false; guardarCarrusel()">Guardar</vs-button>
        </div>
    </vs-popup>

    <vs-popup title="Carrusel" :active.sync="popupCubo">
        <div>
            <div style="font-size: 12px; color: gray;" class="mb-1">Imagen cubo</div>
            <input type="file" name="file3" id="file3" class="w-full inputfile mb-base">

            <vs-button type="gradient" color="primary" style="float: right;"  @click="popupCubo=false; guardarImgCubo()">Guardar</vs-button>
        </div>
    </vs-popup>

    <vx-card class="w-full mb-6 p-8" align="center" style="opacity: 1;">
      <h1>Imagen de fondo</h1>
      <input type="file" name="file5" id="file5" class="w-full inputfile mb-base">

      <vs-button type="gradient" color="primary" @click="guardarFondo()">Guardar</vs-button>
    </vx-card>

    <vx-card class="w-full mb-6 p-8" align="center" style="opacity: 1;">
      <h1>Contenido Carrusel</h1>
      <vs-table search max-items="10" pagination :data="carruseles">
          <template slot="header">
              <vs-button type="gradient" color="primary" @click="id_carrusel=0;img_old='';carrusel={titulo: '', descripcion: '', color: '', color_texto: ''}; popupCarrusel=true">Agregar</vs-button>
          </template>
          <template slot="thead">
              <vs-th style="width: 20px;">#</vs-th>
              <vs-th style="width: 200px;">Imagen</vs-th>
              <vs-th>Carrusel</vs-th>
              <vs-th style="width: 100px;">Color</vs-th>
              <vs-th style="width: 100px;">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td> {{indextr+1}} </vs-td>
                  <vs-td> <img :src="'http://localhost:8000/images/carrousel/'+tr.imagen" style="width: 150px; border-radius: 5px;"> </vs-td>
                  <vs-td> {{tr.titulo}} <br> {{tr.descripcion}} </vs-td>
                  <vs-td> <vs-button :color="tr.color" type="filled">Color</vs-button> </vs-td>
                  <vs-td>
                      <div class="flex">
                            <vx-tooltip text="Editar sección">
                              <vs-button radius type="line" size="large" icon-pack="feather" icon="icon-edit" class="m-1" color="primary" @click="carrusel = tr; img_old = tr.imagen; id_carrusel = tr.id_carrusel;  popupCarrusel=true"></vs-button>
                          </vx-tooltip>
                      </div>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>

    </vx-card>




    <!-- SECCION PARALLAX -->
    <vx-card class="w-full mb-6 p-8" align="center">
      <h1>Contenido Parallax</h1>

      <div class="vx-row" align="left">
        <div class="vx-col md:w-2/3 w-full p-2 mb-6" align="center">
            <vs-input label="Titulo" v-model="parallax.titulo" class="w-full mb-3" />
            <vs-textarea label="Descripción" v-model="parallax.descripcion" class="w-full mb-3" />
            <vs-input label="Color" v-model="parallax.color" class="w-full mb-3" />
            <vs-input label="Color del texto" v-model="parallax.color_texto" class="w-full mb-3" />
            <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de parallax</div>
            <input type="file" name="file2" id="file2" class="w-full inputfile mb-base">

            <vs-button type="gradient" color="primary" @click="id_carrusel=10; guardarParallax()">Guardar</vs-button>
        </div>

        <div class="vx-col md:w-1/3 w-full p-2">
            <vs-table search max-items="10" pagination :data="lados_cubo">
                <template slot="header">
                    <vs-button type="gradient" color="primary" @click="popupCubo=true">Agregar</vs-button>
                </template>
                <template slot="thead">
                    <vs-th style="width: 20px;">#</vs-th>
                    <vs-th>Imagen cubo</vs-th>
                    <vs-th style="width: 100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td> {{indextr+1}} </vs-td>
                        <vs-td> <img :src="'http://localhost:8000/images/carrousel/'+tr.imagen" style="width: 120px; border-radius: 5px;"> </vs-td>
                        <vs-td>
                            <vx-tooltip text="Eliminar esta imagen del cubo">
                                <vs-button radius type="line" size="large" icon-pack="feather" icon="icon-trash" class="m-1" color="danger" @click="elimiarLadoCubo(tr.id_carrusel)"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
      </div>

    </vx-card>




    <!-- SECCION FOOTER -->
    <vx-card class="w-full mb-6 p-8" align="center">
      <h1>Contenido Footer</h1>

      <div class="vx-row" align="left">
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Título" v-model="footer.titulo" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Dirección" v-model="footer.direccion" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Teléfono" type="number" v-model="footer.telefono" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Link Facebook" v-model="footer.url1" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Link Youtube" v-model="footer.url2" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <vs-input label="Link Instagram" v-model="footer.url3" class="w-full mb-3" />
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6">
          <div style="font-size: 12px; color: gray;" class="mb-1">Imagen footer</div>
          <input type="file" name="file4" id="file4" class="w-full inputfile mb-base">
        </div>
        <div class="vx-col md:w-1/3 w-full p-2 mb-6" align="center">
          <br>
          <vs-button type="gradient" class="w-full" color="primary" @click="guardarFooter()">Guardar</vs-button>
        </div>
      </div>

    </vx-card>


</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

Vue.use(axios)

export default {
    data() {
        return {
            usuario: [],
            carruseles: [],
            carrusel: {titulo: '', descripcion: '', color: '', texto: '', color_texto: '', },
            img_old: '',
            id_carrusel: 0,
            popupCarrusel: false,
            parallaxs: [],
            parallax: {titulo: '', descripcion: '', color: '', text: '', color_texto: '', },
            popupParallax: false,
            lados_cubo: [],
            popupCubo: false,
            footer: {titulo: '', direccion: '', telefono: '', url1: '', url2: '', url3: ''},
            img_old_footer: '',
            img_old_parallax: '',
            img_fondo: '',
            img_old_fondo: '',
        }
    },
    components: {
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getCarruseles()
        this.getParallax()
        this.getLadosCubo()
        this.getFooter()
        this.getFondo()
    },
    methods: {
      getCarruseles(){
        let me = this

        me.$vs.loading()
        axios.get('http://localhost:8000/api/carruseles')
        .then(function (response) {
            me.carruseles = response.data
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })

      },
      getParallax(){
        let me = this
        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_parallax')
        .then(function (response) {
            me.parallax = response.data[0]
            me.img_old_parallax = response.data[0].imagen
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      getFondo(){
        let me = this
        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_fondo')
        .then(function (response) {
            me.img_old_fondo = response.data[0].imagen
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      guardarCarrusel(){
        let me = this

        me.$vs.loading()
        let fileImgPreg
        fileImgPreg = document.getElementById("file1").files[0];

        let formData = new FormData();
        formData.append('id_carrusel', me.id_carrusel);
        formData.append('titulo', me.carrusel.titulo);
        formData.append('descripcion', me.carrusel.descripcion);
        formData.append('color', me.carrusel.color);
        formData.append('texto', me.carrusel.texto);
        formData.append('color_texto', me.carrusel.color_texto);
        formData.append('img_carrusel', fileImgPreg);
        formData.append('img_old', me.img_old);
        formData.append('tipo', 1);

        axios.post('http://localhost:8000/api/carruseles', formData)
        .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Carrusel guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.getCarruseles()
        })
        .catch(function (error) { me.$vs.loading.close() })

      },
      guardarParallax(){
        let me = this

        me.$vs.loading()
        let fileImgPreg
        fileImgPreg = document.getElementById("file2").files[0];

        let formData = new FormData();
        formData.append('id_carrusel', 10);
        formData.append('titulo', me.parallax.titulo);
        formData.append('descripcion', me.parallax.descripcion);
        formData.append('color', me.parallax.color);
        formData.append('texto', '0');
        formData.append('color_texto', me.parallax.color_texto);
        formData.append('img_carrusel', fileImgPreg);
        formData.append('img_old', me.img_old_parallax);
        formData.append('tipo', 2);

        axios.post('http://localhost:8000/api/carruseles', formData)
        .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Carrusel guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.getCarruseles()
        })
        .catch(function (error) { me.$vs.loading.close() })

      },
      getLadosCubo(){
        let me = this

        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_lados_cubo')
        .then(function (response) {
            me.lados_cubo = response.data
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      guardarImgCubo(){
        let me = this
        me.$vs.loading()
        let fileImgPreg
        fileImgPreg = document.getElementById("file3").files[0];

        let formData = new FormData();
        formData.append('img_carrusel', fileImgPreg);

        axios.post('http://localhost:8000/api/guardar_img_cubo', formData)
        .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.getLadosCubo()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      elimiarLadoCubo(id_cubo){
        let me = this

        me.$vs.loading()
        axios.get('http://localhost:8000/api/eliminar_img_cubo/' + id_cubo)
        .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Eliminado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.getLadosCubo()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      getFooter(){
        let me = this

        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_footer')
        .then(function (response) {
            me.footer = response.data[0]
            me.img_old_footer = response.data[0].imagen
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      guardarFooter(){
        let me = this

        me.$vs.loading()
        let fileImgPreg
        fileImgPreg = document.getElementById("file4").files[0];

        let formData = new FormData();
        formData.append('titulo', me.footer.titulo);
        formData.append('direccion', me.footer.direccion);
        formData.append('telefono', me.footer.telefono);
        formData.append('url1', me.footer.url1);
        formData.append('url2', me.footer.url2);
        formData.append('url3', me.footer.url3);
        formData.append('imagen', fileImgPreg);
        formData.append('img_old', me.img_old_footer);

        axios.post('http://localhost:8000/api/guardar_footer', formData)
        .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Footer guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.getFooter()
        })
        .catch(function (error) { me.$vs.loading.close() })

      },
      guardarFondo(){
        let me = this

        me.$vs.loading()
        let fileImgPreg
        fileImgPreg = document.getElementById("file5").files[0];

        let formData = new FormData();
        formData.append('id_carrusel', 30);
        formData.append('titulo', 'asdasdasda0');
        formData.append('descripcion', '0');
        formData.append('color', '0');
        formData.append('texto', '0');
        formData.append('color_texto', '0');
        formData.append('img_carrusel', fileImgPreg);
        formData.append('img_old', me.img_old_fondo);
        formData.append('tipo', 4);//fondo

        axios.post('http://localhost:8000/api/carruseles', formData)
        .then(function (res) {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Imagen de fondo guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
        })
        .catch(function (error) { console.log(error);
         me.$vs.loading.close() })
      }

    }
}
</script>


<style>
.uploading-image {
    display: flex;
}

.inputfile{
    border: 1px solid rgb(190, 190, 190);
    width: 100%;
    border-radius: 5px;
    padding: 5px;
    height: 37px;
}
</style>
