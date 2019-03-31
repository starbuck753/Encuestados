/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaGuardada.suscribir(function() {
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
    //this.modelo.leer();

    this.reconstruirLista()
    this.configuracionDeBotones();

    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
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
      var id = e.pregunta.attr('idPregunta');
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        //completar
        if (this.value != ""){
          respuestas.push({textoRespuesta: this.value, cantidad: 0});
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.guardarPregunta(id, value, respuestas);
    });

    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function(){
      var id = $('.list-group-item.active')[0].id;
      contexto.controlador.borrarPregunta(id);
    });
  
    e.botonEditarPregunta.click(function(){
      var id = $('.list-group-item.active')[0].id;
      var preguntaSelec = contexto.modelo.preguntas.filter(pregunta => pregunta.id == id);
      e.pregunta.val(preguntaSelec[0].textoPregunta)
        .attr('idPregunta', id)
        .parents('div').addClass('has-success');

      e.respuesta.find('[name="option[]"]')
        .val(preguntaSelec[0].cantidadPorRespuesta[0].textoRespuesta)
        .parents('div').addClass('has-success');
 
      var $template = $('#optionTemplate');

      for (var n=1; n<preguntaSelec[0].cantidadPorRespuesta.length; n++){
        var $clone = $template
            .clone()
            .removeClass('hide')
            .addClass('has-success')
            .attr('id', "respuesta" + preguntaSelec[0].cantidadPorRespuesta[n].textoRespuesta)
            .insertBefore($template),
          $option = $clone.find('[name="option[]"]')
            .val(preguntaSelec[0].cantidadPorRespuesta[n].textoRespuesta);

        // agregado de nuevo campo al formulario
        $('#localStorageForm').formValidation('addField', $option);
      };
    });

    e.borrarTodo.click(function(){
      contexto.modelo.preguntas.forEach(function(pregunta) {
        contexto.controlador.borrarPregunta(pregunta.id);
      })
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
    
    var e = this.elementos;
    e.pregunta.attr('idPregunta', "");
  },
};
