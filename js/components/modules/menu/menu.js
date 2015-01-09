Proyect.Menu = {};
(function(){
  "use strict";

  var idmodule = "#menu-content";
  var alimentoModel;
  var menuMainView;
  var alimentosCol;
  var myData;

  this.startModule= function( id ){
      myData = getData();
      createMenu(); 
  };

  this.refreshModule = function (){
      myData = getData();
      App.cargarMenu()
  };

  var getData = function () {
      return LITERALS.getModuleLiterals("menu");
  };

  var createMenu = function(){
      alimentosCol = App.alimentosCol;
      menuMainView = new MenuMainView();
  };

  var randomCollection = function (list, num, complete) {
      var random = _.sample(list, num);
      if (list.length && complete !== false && random.length < num) {
        var j = 0;
        for (var i=random.length; i <= num; i++) {
          if (!random[j]) {
            j=0;
          }
          random.push(random[j]);
          j++;
        }
      }
      return random;
  }

  var getModelNames = function (models, ySeparator) {
    var separator = ", ";
    var end = ".";
    var names;

    if (ySeparator) {
      separator = " " + myData.and + " ";
      end = "";
    }

    names = _.uniq(_.pluck(_.pluck(models, "attributes"), "nombre")).join(separator) + end

    return names.toLowerCase();
  }


/*********************************************************************************/
/* INSTANCE BACKBONE ELEMENTS MVC                                                */
/*********************************************************************************/

  //instance Model
  var AlimentoModel = Backbone.Model.extend({
      initialize: function(){
        console.info("Model! -> My Menu");
      }    
  });  

  //instance Collection
  var AlimentosCol = Backbone.Collection.extend({      
      model: AlimentoModel
  });

  //Main View Constructor
  var MenuMainView = Backbone.View.extend({    
      el: idmodule,   

      initialize: function(){      
          this.$tpl = $("#tpl_menu").html();
          this.tpl = _.template(this.$tpl);
          this.render();
          this.listenTo(alimentosCol, 'change', this.render);

      }, 

      getAlimentos: function () {

          this.soja = alimentosCol.where({ subtipo: "soja" }); 
          this.pan = alimentosCol.where({ subtipo: "panIntegral", enabled: true }); 
          this.desayunos = alimentosCol.where({ tipo: "desayuno", enabled: true, visible: true });
          this.legumbres = alimentosCol.where({ tipo: "legumbre", enabled: true, visible: true });
          this.frutasAcidas = alimentosCol.where({ tipo: "fruta", subtipo: "ácida", enabled: true });                      
          this.frutasDulces = alimentosCol.where({ tipo: "fruta", subtipo: "dulce", enabled: true });     
          this.frutasNeutras = alimentosCol.where({ tipo: "fruta", subtipo: "neutra", enabled: true });     
          this.verduras = alimentosCol.where({ tipo: "verdura", enabled: true });     
          this.carbohidratos = alimentosCol.where({ tipo: "carbohidrato", enabled: true, visible: true }); 
          this.huevos = alimentosCol.where({ tipo: "proteina", subtipo: "huevos", enabled: true });  
          this.proteinaVegetal = alimentosCol.where({ tipo: "proteina", subtipo: "vegetal", enabled: true });
          this.marisco = alimentosCol.where({ tipo: "proteina", subtipo: "marisco", enabled: true });
          this.pescado = alimentosCol.where({ tipo: "proteina", subtipo: "pescado", enabled: true }); 
          this.carne = alimentosCol.where({ tipo: "proteina", subtipo: "carne", enabled: true }); 
          this.verdurasCocidas = alimentosCol.where({ tipo: "verdura", cocida: true, enabled: true });     
          this.verdurasCrudas = alimentosCol.where({ tipo: "verdura", cruda: true, enabled: true }); 

      },

      getAlimentosAleatorios: function () {

          // No repetir en dias consecutivos
          // lo mas aleatorio posible
          this.desayunos = randomCollection(this.desayunos, 7);  
          this.frutaAcida = randomCollection(this.frutasAcidas, 13);  
          this.frutaDulce = randomCollection(this.frutasDulces, 13);
          this.frutaNeutra = randomCollection(this.frutasNeutras, 4);
          this.verduraCocida = randomCollection(this.verdurasCocidas, 20);
          this.verduraCruda = randomCollection(this.verdurasCrudas, 20); 
          this.legumbre = randomCollection(this.legumbres, 2);
          this.hidrato = randomCollection(this.carbohidratos, 3);
          this.proteina = randomCollection(this.carne, 6)   
                            .concat(randomCollection(this.pescado, 6))
                            .concat(randomCollection(this.marisco, 2))    
                            .concat(this.proteinaVegetal);

      },

      emptyList: function () {
        
        this.list = [];

      },

      emptyFrutas: function () {
        
        this.contadorFrutas = 0;

      },

      addToList: function (item) {
        
        this.list.push(item);  
        item.nombre = item.nombre.toLowerCase(); 
        return item
      },

      addToListByList: function (items) {
        var list = this.list;
        _.each(items, function (item) {
          list.push(item.attributes);
          item.attributes.nombre = item.attributes.nombre.toLowerCase(); 
        })

        return items
      },

      isAlimentosObligatorios: function () {

          this.faltanProteinas = false;
          this.faltanHidratos = false;
          this.faltanVerduras = false;
          this.faltanDesayunos = false;
          this.faltanFrutas = false;

          if (!this.desayunos.length) {
              this.faltanDesayunos = true
          }
          if (!this.proteina.length) {
              this.faltanProteinas = true
          }    
          if (!this.hidrato.length) {
              this.faltanHidratos = true
          } 
          if (!this.verduraCocida.length
              || !this.verduraCruda.length) {
              this.faltanVerduras = true
          }          
          if (!this.frutaAcida.length
              || !this.frutaDulce.length) {
              this.faltanFrutas = true
          }

      },

      alimentosAlternativos: function () {

          if (!this.huevos.length) {
              this.huevos = this.proteina;
          } 
          if (!this.carne.length) {
              this.carne = this.proteina;
          }   
          if (!this.pescado.length) {
              this.pescado = this.proteina;
          }    
          if (!this.proteinaVegetal.length) {
              this.proteinaVegetal = this.proteina;
          }  
          if (!this.marisco.length) {
              this.marisco = this.proteina;
          } 
          if (!this.frutaNeutra.length) {
              this.frutaNeutra = this.frutaDulce;
          }    
          if (!this.legumbre.length) {
              this.legumbre[0] = randomCollection(this.hidrato, 1);
              this.legumbre[1] = randomCollection(this.proteina, 1);
          }
      },

      isSojaEnabled: function () {

        return this.soja[0].attributes.enabled ? myData.yogurSoja : "" 
      },

      isPanIntegralEnabled: function () {
 
        return this.pan.length ? myData.panIntegral + getModelNames(this.pan) : "" 
      },

      getDesayuno: function (item) {

        var that = this,
            frutaAcida = this.frutaAcida[6 + this.contadorFrutas].attributes,
            frutaDulce = this.frutaDulce[6 + this.contadorFrutas].attributes,
            nombreFruta;

        this.contadorFrutas++;

        _.each(item.lista, function (subitem) {
            if (subitem.tipo === "fruta") {
              if (subitem.subtipo === "ácida") {
                if (frutaAcida.fueraDelDesayuno) {
                  frutaAcida = that.frutaAcida[6 + that.contadorFrutas].attributes;
                  that.contadorFrutas++;
                }
                nombreFruta = subitem.nombre = frutaAcida.nombre;

              } else if (subitem.subtipo === "dulce"){
                nombreFruta = subitem.nombre = frutaDulce.nombre;
              } 
            }
            that.list.push(subitem)
        })
          
        if (item.nombreDinamico) {
          item.nombre = LITERALS.replaceText(item.nombreDinamico, nombreFruta.toLowerCase());
        }

        return item.nombre
      },

      getAlimentosPorSemana: function () {

        this.json = {
              data: myData,
              especiales: {
                soja: this.isSojaEnabled(), 
                pan: this.isPanIntegralEnabled()
              },
              alimentos: { 
                  otrosHidratos: getModelNames(this.carbohidratos),
                  otrasVerdurasCocidas: getModelNames(this.verdurasCocidas),
                  otrasVerdurasCrudas: getModelNames(this.verdurasCrudas),
                  otrasFrutasDulces: getModelNames(this.frutasDulces),
                  otrasFrutasAcidas: getModelNames(this.frutasAcidas),
                  otrasFrutasNeutras: getModelNames(this.frutasNeutras),
                  otrasCarnes: getModelNames(this.carne),
                  otrasProteinas: getModelNames(this.proteina),
                  otrosPescados: getModelNames(this.pescado), 
                  otrasLegumbres: getModelNames(this.legumbres), 
                  otrosDesayunos: getModelNames(this.desayunos),
                  lunes: {
                    desayuno: this.getDesayuno(this.desayunos[0].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[0].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[0], this.verduraCocida[1]]), true),
                      hidrato: this.addToList(this.hidrato[0].attributes)
                    },
                    merienda: {
                      frutaNeutra: this.addToList(this.frutaNeutra[0].attributes) 
                    },
                    cena: {
                      verdurasCrudas: getModelNames(this.addToListByList(
                        [this.verduraCruda[0], this.verduraCruda[1]]), true),
                      proteinas: this.addToList(randomCollection(this.carne, 1)[0].attributes)
                    }
                  },
                  martes: {
                    desayuno: this.getDesayuno(this.desayunos[1].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[1].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[4], this.verduraCocida[3]]), true),
                      legumbre: this.addToList(this.legumbre[0].attributes)
                    },
                    merienda: {
                      frutaDulce: this.addToList(this.frutaDulce[0].attributes)
                    },
                    cena: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[6], this.verduraCocida[7]]), true),
                      proteinas: this.addToList(randomCollection(this.pescado, 1)[0].attributes)
                    }
                  },
                  miercoles: {
                    desayuno: this.getDesayuno(this.desayunos[2].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[2].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[8], this.verduraCocida[9]]), true),
                      proteinas: this.addToList(randomCollection(this.marisco, 1)[0].attributes)
                    },
                    merienda: {
                      frutaNeutra: this.addToList(this.frutaNeutra[1].attributes)
                    },
                    cena: {
                      verdurasCrudas: getModelNames(this.addToListByList(
                        [this.verduraCruda[2], this.verduraCruda[3]]), true),
                      proteinas: this.addToList(randomCollection(this.carne, 1)[0].attributes)
                    }
                  },
                  jueves: {
                    desayuno: this.getDesayuno(this.desayunos[3].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[3].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[11], this.verduraCocida[14]]), true),
                      hidrato: this.addToList(this.hidrato[1].attributes)
                    },
                    merienda: {
                      frutaDulce: this.addToList(this.frutaDulce[1].attributes)
                    },
                    cena: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[15], this.verduraCocida[13]]), true),
                      proteinas: this.addToList(randomCollection(this.pescado, 1)[0].attributes)
                    }
                  },
                  viernes: {
                    desayuno: this.getDesayuno(this.desayunos[4].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[4].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[17], this.verduraCocida[10]]), true),
                      legumbre: this.addToList(this.legumbre[1].attributes)
                    },
                    merienda: {
                      frutaNeutra: this.addToList(this.frutaNeutra[2].attributes)
                    },
                    cena: {
                      verdurasCrudas: getModelNames(this.addToListByList(
                        [this.verduraCruda[4], this.verduraCruda[5]]), true),
                      proteinas: this.addToList(randomCollection(this.carne, 1)[0].attributes)
                    }
                  },
                  sabado: {
                    desayuno: this.getDesayuno(this.desayunos[5].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[5].attributes)
                    },
                    almuerzo: {
                      verdurasCrudas: getModelNames(this.addToListByList(
                        [this.verduraCruda[6], this.verduraCruda[7]]), true),
                      proteinas: this.addToList(randomCollection(this.proteinaVegetal, 1)[0].attributes)
                    },
                    merienda: {
                      frutaDulce: this.addToList(this.frutaDulce[2].attributes)
                    },
                    cena: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[2], this.verduraCocida[3]]), true),
                      proteinas: this.addToList(randomCollection(this.pescado, 1)[0].attributes)
                    }
                  },
                  domingo: {
                    desayuno: this.getDesayuno(this.desayunos[6].attributes),
                    mediaMañana: {
                      frutaAcida: this.addToList(this.frutaAcida[6].attributes)
                    },
                    almuerzo: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[6], this.verduraCocida[5]]), true),
                      hidrato: this.addToList(this.hidrato[2].attributes)
                    },
                    merienda: {
                      frutaNeutra: this.addToList(this.frutaNeutra[3].attributes)
                    },
                    cena: {
                      verdurasCocidas: getModelNames(this.addToListByList(
                        [this.verduraCocida[4], this.verduraCocida[7]]), true),
                      proteinas: this.addToList(randomCollection(this.huevos, 1)[0].attributes)
                    }
                  }
              }
          };

          return this.json
      },

      slider: function () {

        $("#menu-semanal").hammer()
          .on('swipeleft', function(){
            $(this).carousel('next'); 
          })
          .on('swiperight', function(){
            $(this).carousel('prev'); 
          })
      },

      listaDeLaCompra: function () {
        var listas = _.groupBy(this.list, "tipo");
        var listaTxt = "";
        var listaSort = [];
        var tipos = ["desayuno", "fruta", "verdura", "carbohidrato", "legumbre", "proteina"];

        listaSort.push(listas.desayuno);
        listaSort.push(listas.fruta);
        listaSort.push(listas.verdura);
        listaSort.push(listas.carbohidrato);
        listaSort.push(listas.legumbre);
        listaSort.push(listas.proteina);

        _.each(listaSort, function (lista, i) {
            var sep = "", tipo = myData[tipos[i]];
            lista = _.groupBy(lista, "nombre");

            listaTxt += "<li><strong>" + tipo + ":</strong> ";
            _.each(lista, function (item, i) {

              listaTxt += sep + i.toLowerCase() + " " + item.length 
                + (item.length > 1 ? myData.raciones : myData.racion); 

              sep = ", ";
            });
          listaTxt += ".</li>"
        })

        return listaTxt
        
      },

      renderLista: function (listaTxt) {

        $("#listaCompra").html(  
          listaTxt
        )
      },

      setHeightItem: function () {
        var heights = $(".carousel-caption").map(function () {
            return $(this).height();
        }).get(),

        maxHeight = Math.max.apply(null, heights);
        $(".carousel-inner").height(maxHeight + 35);
      },

      faltanAlimentos: function () {
          var error = myData.errorAlimentos;
          if (this.faltanVerduras
              || this.faltanHidratos
              || this.faltanProteinas
              || this.faltanDesayunos
              || this.faltanFrutas
              ) {
            return '<span class="fa fa-exclamation-triangle"> </span> &nbsp;' + error
          }

          return false      
      },

      renderMenu: function (menuView) {

          this.$el.html(menuView);
      },

      render: function (){
          this.emptyList();
          this.emptyFrutas();

          this.getAlimentos();
          this.getAlimentosAleatorios();
          this.isAlimentosObligatorios();

          var mensajeError = this.faltanAlimentos();
          if (mensajeError) {
            this.renderLista("");
            this.renderMenu(mensajeError);

          } else {
            this.alimentosAlternativos();
            this.renderMenu(this.tpl(this.getAlimentosPorSemana()));
            this.renderLista(this.listaDeLaCompra());
            this.setHeightItem();
            this.slider();
          }
      }
  });  
  
  
}).apply( Proyect.Menu );
