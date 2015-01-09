Proyect.Menu = {};
(function(){
  "use strict";

  var idmodule = "#menu-content";
  var menuModel;
  var menuCollectionView;
  var menuMainView;
  var menuCollection;
  var myData;
  

  this.startModule= function( id ){
    myData = getData();
    instanceTemplate(); 
  };

  this.refreshModule = function (){
      myData = getData();
      menuModel.set(myData);
  };

  var getData = function () {
    return LITERALS.getModuleLiterals("menu");
  };


  var instanceTemplate = function(){
    menuModel = new MenuModel(myData);  
    menuMainView = new MenuMainView({model: menuModel});
    
  };

  var instanceCollection = function () {

    menuCollection = new MenuCollection();

    for (var x=0;x<myData.table.length;x++){
      menuCollection.add(myData.table[x]);
    }
   
    var menuListView = new MenuCollectionView( { model: menuCollection});   
  };


/*********************************************************************************/
/* INSTANCE BACKBONE ELEMENTS MVC                                                */
/*********************************************************************************/

  //instance Model
  var MenuModel = Backbone.Model.extend({
    initialize: function(){
      console.info("Model! -> My Menu");
    },      
  });  

  //instance Collection
  var MenuCollection = Backbone.Collection.extend({      
      model:MenuModel,
      id:"menu"
  });


  //Collection View
  var MenuCollectionView = Backbone.View.extend({    
    el: "#menu",     
    initialize: function(){
      console.info("ListView! -> My Menu");
      this.render();
    },
    
    render:function () {      
      _.each(this.model.models, function (menu, num) {
            menu.set("id", "menu-"+ num )
            var vista_menu = new MenuItemView({model:menu});          
      },this);
    }

  }); 

  //Collection Item View
  var MenuItemView = Backbone.View.extend({
    el: "#menu_item_list", 
    events: {},
    initialize: function(){      
      console.info("View! -> My Menu");      
      this.render();
    },

    render: function(){             
      var template = _.template($('#tpl_menu_item').html(),this.model);        
      this.$el.append(template);    
    }
  });

  //Main View Constructor
  var MenuMainView = Backbone.View.extend({    
    el: "#menu",     
      initialize: function(){      
          this.$hook  = $("#tpl_menu").html()
          this.render();
          this.listenTo(this.model, 'change', this.render);
      }, 

      render: function(){
          this.tpl = _.template(this.$hook, this.model.attributes)
          $("#menu").html(this.tpl);
          instanceCollection();
      }
  });  
  
  
}).apply( Proyect.Menu );
