/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.votoAgregado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    return this.ultimoId++;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function(id) {
    this.preguntas = this.preguntas.filter(pregunta => pregunta.id != id);
    this.guardar();
    this.preguntaBorrada.notificar();
  },

  /*editarPregunta: function(id) {
    
    this.preguntas.find(pregunta => pregunta.id = id).nombre = nombre;
    this.preguntas.find(pregunta => pregunta.id = id).respuestas = respuestas;
    this.guardar();

    this.preguntaEditada.notificar();
  },*/

  agregarVoto: function (nombrePregunta,respuestaSeleccionada) {
    this.preguntas.find(pregunta => pregunta.textoPregunta == nombrePregunta)
      .cantidadPorRespuesta.find(respuesta => respuesta.textoRespuesta == respuestaSeleccionada).cantidad ++;
    this.guardar();
    this.votoAgregado.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem("preguntas",JSON.stringify(this.preguntas));
  },

  leer: function(){
    this.preguntas = localStorage.getItem("preguntas") == undefined ? this.preguntas : JSON.parse(localStorage.getItem("preguntas"));
  }
};
