/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  guardarPregunta: function(id, pregunta, respuestas) {
    this.modelo.guardarPregunta(id, pregunta, respuestas);
  },

  borrarPregunta: function(id) {
    this.modelo.borrarPregunta(id);
  },

  agregarVoto: function(nombrePregunta,respuestaSeleccionada) {
    this.modelo.agregarVoto(nombrePregunta,respuestaSeleccionada);
  },

};
