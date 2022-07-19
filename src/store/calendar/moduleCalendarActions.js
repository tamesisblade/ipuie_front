/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from '@/axios.js'
import {server} from '../../main'

export default {
  addEvent ({ commit }, event) {

    let formData = new FormData();
        formData.append('id', 0);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('img_portada', event.img_portada);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('url', event.url);
        formData.append('link', event.link);

    return new Promise((resolve, reject) => {
      axios.post(server+'eventos', formData)
      .then((response) => {
        commit('ADD_EVENT', Object.assign(event, {id: response.data.id}))
        resolve(response)
        location.reload()
      })
      .catch((error) => { reject(error) })
    })
  },
  fetchEvents ({ commit }) {
    // let eventos = [
    //   {id: '1', title: 'evento prueba', url: 'prueba.com', startDate: '2021-10-20 22:28:10', endDate: '2021-10-21 23:28:10', "classes": "event-success", "label": "business"}
    // ]
    let usuario = JSON.parse(localStorage.getItem('usuario'))
    return new Promise((resolve, reject) => {
      axios.get(server+'eventos')
        .then((response) => {
          commit('SET_EVENTS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchEventLabels ({ commit }) {
    let eventos = [
      { text: 'Urgente', color: 'danger'},
      { text: 'Importante', color: 'warning'},
      { text: 'Normal', color: 'primary'},
      { text: 'Baja', color: 'success'},
    ];
    return new Promise((resolve, reject) => {
      commit('SET_LABELS', eventos)
      resolve(eventos)
    })
  },
  editEvent ({ commit }, event) {
    if( event.startDate == 'Invalid date' ){
      alert('Seleccione la fecha de inicio');
      return;
    }
    if( event.endDate == 'Invalid date' ){
      alert('Seleccione la fecha de fin');
      return;
    }
    let formData = new FormData();
        formData.append('id', event.id);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('img_portada', event.img_portada);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('url', event.url);
        formData.append('link', event.link);

    return new Promise((resolve, reject) => {
      axios.post(server+'eventos', formData)
        .then((response) => {

          // Convert Date String to Date Object
          const event = response.data
          event.startDate = new Date(event.startDate)
          event.endDate = new Date(event.endDate)

          commit('UPDATE_EVENT', event)
          resolve(response)
          location.reload()
        })
        .catch((error) => { reject(error) })
    })
  },
  removeEvent ({ commit }, eventId) {
    return new Promise((resolve, reject) => {
      axios.get(server+`delete_agenda/${eventId}`)
        .then((response) => {
          commit('REMOVE_EVENT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  eventDragged ({ commit }, event) {
    let formData = new FormData();
        formData.append('id', event.id);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('img_portada', event.img_portada);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('url', event.url);
        formData.append('link', event.link);
    return new Promise((resolve, reject) => {
      axios.post(server+'save_agenda_docente', formData)
        .then((response) => {

          // Convert Date String to Date Object
          const event = response.data
          event.startDate = new Date(event.startDate)
          event.endDate = new Date(event.endDate)

          commit('UPDATE_EVENT', event)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
