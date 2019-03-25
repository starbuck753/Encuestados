/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaBorrada.suscribir(function() {
    contexto.reconstruirLista();
  });
  /*this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });*/
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.modelo.leer();

    this.reconstruirLista()
    this.configuracionDeBotones();

    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;

    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var nuevoItem = $(`<li class='list-group-item' id='${pregunta.id}'></li>`);
    
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());

    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        //completar
        if (this.value != ""){
          respuestas.push({textoRespuesta: this.value, cantidad: 0});
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });

    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function(){
      var id = $('.list-group-item.active')[0].id;
      contexto.controlador.borrarPregunta(id);
    });
  
    e.botonEditarPregunta.click(function(){
      var id = $('.list-group-item.active')[0].id;
      var pregunta = contexto.modelo.preguntas.filter(pregunta => pregunta.id == id);
      e.pregunta.val(pregunta[0].textoPregunta);
      $('[name="option[]"]').val(pregunta[0].cantidadPorRespuesta[0].textoRespuesta);
 
      for (var n=1; n<=pregunta[0].cantidadPorRespuesta.length; n++){
        var $template = $('#optionTemplate'),
          $clone = $template
            .clone()
            .removeClass('hide')
            .attr('id', "respuesta" + pregunta[0].cantidadPorRespuesta[n].textoRespuesta)
            .insertBefore($template),
          $option = $clone.find('[name="option[]"]')
            .val(pregunta[0].cantidadPorRespuesta[n].textoRespuesta);

        // agregado de nuevo campo al formulario
        $('#localStorageForm').formValidation('addField', $option);    
      };
      
      contexto.controlador.borrarPregunta(id);
    });

    e.borrarTodo.click(function(){
      contexto.modelo.preguntas.forEach(function(pregunta) {
        contexto.controlador.borrarPregunta(pregunta.id);
      })
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
