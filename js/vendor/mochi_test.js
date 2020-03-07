Image.prototype.load = function( url, callback, pcallback ) {
    var thisImg = this,
        xmlHTTP = new XMLHttpRequest();

    thisImg.completedPercentage = 0;

    xmlHTTP.open( 'GET', url , true );
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function( e ) {
        var h = xmlHTTP.getAllResponseHeaders(),
            m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
            mimeType = m[ 1 ] || 'image/png';
            // Remove your progress bar or whatever here. Load is done.

        var blob = new Blob( [ this.response ], { type: mimeType } );
        thisImg.src = window.URL.createObjectURL( blob );
        thisImg.onload = function()
        {
        	if ( callback ) callback( thisImg );
        }
    };

    xmlHTTP.onprogress = function( e ) {
        if ( e.lengthComputable )
            thisImg.completedPercentage = parseInt( ( e.loaded / e.total ) * 100 );
        if(pcallback) pcallback(thisImg);
    };

    xmlHTTP.onloadstart = function() {
        // Display your progress bar here, starting at 0
        thisImg.completedPercentage = 0;
    };

    xmlHTTP.onloadend = function() {
        // You can also remove your progress bar here, if you like.
        thisImg.completedPercentage = 100;
    }

    xmlHTTP.send();
};


// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************

Number.prototype.intToHex = function()
{
	var hex = parseInt(this).toString(16);
	return (hex.length < 2) ? "0" + hex : hex;
};
Number.prototype.makeColor = function()
{
	var value = Math.min(Math.max(0,this), 1) * 510;

    var redValue;
    var greenValue;
    if (value < 255) {
        redValue = 255;
        greenValue = Math.sqrt(value) * 16;
        greenValue = Math.round(greenValue);
    } else {
        greenValue = 255;
        value = value - 255;
        redValue = 256 - (value * value / 255)
        redValue = Math.round(redValue);
    }

    return "#" + redValue.intToHex() + greenValue.intToHex() + "00";
};


// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************

String.prototype.is_number = function()
{
	return (this.match(/[0-9]+/g) != null ? this.match(/[0-9]+/g) : []).length > 0;
};

String.prototype.is_placa = function()
{
	return (this.toUpperCase().match(/^([A-Z]{3})([0-9]{3})$/g) != null ? this.toUpperCase().match(/^([A-Z]{3})([0-9]{3})$/g) : []).length > 0;
};

// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************


Number.prototype.money = function(c=0, d=',', t='.')
{
	var n = this;
	var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************

String.prototype.get_clockwise = function(char, index)
{
	var split = this.split(char);
	return split[split.length - index];
};


// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************

var mochi_addon = new Class(
	{
		_config: null,
		app: null,
		_class: null,
		_me: null,
		initialize: function(pconfig, _class, inst)
		{
			this._config = pconfig;
			this.app = this._config.app;
			this._class = _class;
			this._me = inst;
			return this;
		},
		run_me: function()
		{
			this._class.controller.name = this.app._config.name;
			this._class.controller.app = this.app;
			this._class.controller.addon = this._me;
			this._class.controller.el = this.app.el;
			this._class.controller.cl = this.app.cl;

			this._class.model.name = this.app._config.name;
			this._class.model.app = this.app;
			this._class.model.addon = this._me;
			this._class.model.el = this.app.el;
			this._class.model.cl = this.app.cl;

			this._class.view.name = this.app._config.name;
			this._class.view.app = this.app;
			this._class.view.addon = this._me;
			this._class.view.el = this.app.el;
			this._class.view.cl = this.app.cl;

			this.add_method(this.app.c, this._class.controller);
			this.add_method(this.app.m, this._class.model);
			this.add_method(this.app.v, this._class.view);
		},
		add_method: function(dest, ori)
		{
			if(dest == null || ori == null) return;

			dest[this._config.name] = {};
			for(var f in ori)
			{
				if(!ori.hasOwnProperty(f)) continue;

				var val = ori[f];
				dest[this._config.name][f] = val;
			}
		},
		show: function()
		{
			this.execc({
				c: ["main_addon"]
			});
		},
		execc: function(config)
		{
			config.addon = this._config.name;
			this.app.execc(config);
		},
		execm: function(config)
		{
			config.addon = this._config.name;
			this.app.execm(config);
		},
		render: function(config)
		{
			config.addon = this._config.name;
			this.app.render(config);
		},
		post: function(config)
		{
			config.addon = !config.addon ? this._config.name : config.addon;
			config.post = this._config.post;
			this.app.post(config);
		},
		append: function(config)
		{
			config.addon = this._config.name;
			this.app.render(config);	
		}
	});



var mochi_app = new Class({
	_config: null,
	el: Array(),
	cl: Array(),
	c: null,
	m: null,
	v: null,
	color: null,
	b: Array(),
	lang: "",
	exec: false,
	initialize:function(pconfig, _class, inst)
	{
		this.exec = false;
		this._config = pconfig;
		this.lang = this._config.lang || "esp";
		this.el.bbox = typeof(this._config.bbox) == "string" ? document.getElementById(this._config.bbox) : this._config.bbox;

		this.c = _class.controller;
		this.m = _class.model;
		this.v = _class.view;
		this.color = pconfig.color;

		this.c.app = inst || this;
		this.c.name = this._config.name;
		this.c.lang = this.lang;
		this.c.el = this.el;
		this.c.cl = this.cl;
		this.m.app = this;
		this.m.name = this._config.name;
		this.m.lang = this.lang;
		this.m.el = this.el;
		this.m.cl = this.cl;
		this.v.app = this;
		this.v.name = this._config.name;
		this.v.lang = this.lang;
		this.v.el = this.el;
		this.v.cl = this.cl;
	},
	parent_run: function()
	{
		this.exec = true;
	},
	set_bbox: function(bbox)
	{
		var b = typeof(bbox) == "string" ? { bbox: bbox, name: this._config.name } : bbox;
		b.name = !b.name ? this._config.name : b.name;
		if(!b.bbox) return;
		this._config.bbox = bbox.bbox;
		this.el.bbox = typeof(b.bbox) == "string" ? document.getElementById(`${b.name}_${b.bbox}`) : b.bbox;	
	},
	add2mvc: function(mvc, obj)
	{
		mvc.assign(mvc, obj);
	},
	callbacks: function(pconfig)
	{
		var origen = !pconfig.addon ? this.c : this.c[pconfig.addon];

		if(pconfig.c != null && pconfig.c != undefined)
		{
			if(Array.isArray(pconfig.c))
			{
				for(var f of pconfig.c)
				{
					if(origen[f])
						origen[f](pconfig.vars || {});
				}
			}else if(typeof(pconfig.c) == "string")
			{
				if(origen[f])
					origen[f](pconfig.vars || {});
			}
		}

		if(pconfig.ev)
		{
			for(var e in pconfig.ev)
			{
				if(pconfig.ev.hasOwnProperty(e))
				{
					if(this.el[e])
					{
						var evs = pconfig.ev[e];
						for(var ev in evs)
						{
							if(evs.hasOwnProperty(ev))
							{
								this.event(this.el[e], ev, evs[ev], pconfig.vars || {}, pconfig.addon);
							}
						}
					}else if(this.cl[e])
					{
						var els = this.cl[e];
						for(var el of els)
						{
							var evs = pconfig.ev[e];
							for(var ev in evs)
							{
								if(evs.hasOwnProperty(ev))
								{
									this.event(el, ev, evs[ev], pconfig.vars || {}, pconfig.addon);
								}
							}
						}
					}
				}
			}
		}
	},
	event: function(el, ev, calls, vars, addon)
	{
		var origen = !addon ? this.c : this.c[addon];
		var me = this;
		var data = vars;
		//data.this = el;
		el[`on${ev}`] = function(dataev)
		{
			data.ev = dataev;
			data.el = this;
			if(typeof(calls) == "string")
			{
				if(origen[calls])
					origen[calls](data);
			}else if(Array.isArray(calls))
			{
				for(var foo of calls)
				{
					if(origen[foo])
						origen[foo](data);
				}
			}
		}
	},
	execc: function(pconfig)
	{
		/*
		c:[string] nombre del metodo controlador a invocar
		addon: [string] addon name from where will be called the function
		vars: [object] variables que se llaman en c0 y c1
		c0:[Array = funciones del controlador] se invocan antes de la invocacion
		c1:[Array = funciones del controlador] se invocan despues de la invocacion
		*/

		var origen = !pconfig.addon ? this.c : this.c[pconfig.addon];

		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars,
			addon: pconfig.addon
		});

		if(typeof(pconfig.c) == "string")
		{
			if(origen[pconfig.c])
				origen[pconfig.c](pconfig.vars || {});
		}else if(Array.isArray(pconfig.c))
		{
			for(var c of pconfig.c)
			{
				if(origen[c])
					origen[c](pconfig.vars || {});
			}
		}

		this.callbacks({
			c: pconfig.c1 || pconfig.c2,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
	},
	execm: function(pconfig)
	{
		/*
		m:[string] nombre del metodo modelo a invocar
		addon: [string] addon name from where will be called the function
		vars: [object] variables que se llaman en c0 y c1
		c0:[Array = funciones del controlador] se invocan antes de la invocacion
		c1:[Array = funciones del controlador] se invocan despues de la invocacion
		*/

		var origen = !pconfig.addon ? this.m : this.m[pconfig.addon];

		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
		if(origen[pconfig.m])
			origen[pconfig.m](pconfig.vars || {});

		this.callbacks({
			c: pconfig.c1,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
	},
	post: function(pconfig)
	{
		/*
		cmd:[string] nombre del metodo controlador a invocar
		data: [object] variables que se envian al servidor como variables a procesar
		vars: [object] variables que se llaman en c0 y c1
		c0:[Array = funciones del controlador] se invocan antes del post
		c1:[Array = funciones del controlador] se invocan despues del post
		c2:[Array = funciones del controlador] se invocan en la respuesta del post
		*/

		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
		var me = this;

		var xhr = new XMLHttpRequest();
		xhr.open('POST', this._config.post.trim() == "" ? pconfig.post : this._config.post, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function (p) {
			if(xhr.readyState == 4 && xhr.status == 200)
			{
				resp = JSON.parse(xhr.responseText);
				me.callbacks({
					c: pconfig.c2,
					vars: {args: pconfig.vars, resp: resp},
					addon: pconfig.addon
				});
			}
		};
		xhr.send(`cmd=${pconfig.cmd}&f=${this._config.f || "main"}&addon=${pconfig.addon || "-"}&i=${JSON.stringify(pconfig.data)}`);

		this.callbacks({
			c: pconfig.c1,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
	},
	create_view: function(pconfig)
	{
		/*
		name:[string]
		v:[Array = funciones del view | string = contenido html]
		vars: [object] variables que se llaman en c0, c1, c2 y en las vistas
		c0:[Array = funciones del controlador] se invocan antes del render
		c1:[Array = funciones del controlador] se invocan durante el render
		c2:[Array = funciones del controlador] se invocan despues del render
		styles: [string]
		*/

		this.el[pconfig.name] = document.createElement("div");
		this.el[pconfig.name].id = this._config.name+"_"+pconfig.name;
		if(pconfig.styles)
			this.el[pconfig.name].setAttribute("style", pconfig.styles);
		this.el.bbox.appendChild(this.el[pconfig.name]);
		this.render({
			bbox: pconfig.name,
			v: pconfig.v,
			c0: pconfig.c0,
			c1: pconfig.c1,
			c2: pconfig.c2,
			ev: pconfig.ev,
			vars: pconfig.vars
		});
	},
	render: function(pconfig)
	{
		/*
		bbox:[string] nombre del elemento padre o contenedor
		addon: [string] addon name from where will be called the function
		v:[Array = funciones del view | string = contenido html]
		ev:[ obj = objects with events ]
		vars: [object] variables que se llaman en c0, c1, c2 y en las vistas
		c0:[Array = funciones del controlador] se invocan antes del render
		c1:[Array = funciones del controlador] se invocan durante el render
		c2:[Array = funciones del controlador] se invocan despues del render
		*/

		var origen = !pconfig.addon ? this.v : this.v[pconfig.addon];

		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars,
			addon: pconfig.addon
		});
		
		var inner = ``;
		for(var e in this.el)
		{
			if(!this.el.hasOwnProperty(e.trim())) continue;
			if(e.trim() != pconfig.bbox) continue;

			var el = this.el[e];
			if(Array.isArray(pconfig.v))
			{
				for(var f in pconfig.v)
				{
					if(pconfig.v.hasOwnProperty(f))
					{
						var foo = pconfig.v[f];

						if(!origen[foo]) continue;

						inner += origen[foo](pconfig.vars || pconfig);
					}
				}
			}else if(typeof(pconfig.v) == "string")
			{
				inner = pconfig.v;
			}

			el.innerHTML = inner;
			this.callbacks({
				c: pconfig.c1,
				vars: pconfig.vars,
				addon: pconfig.addon
			});
		}

		this.bind_el(pconfig);

		this.callbacks({
			c: pconfig.c2,
			vars: pconfig.vars,
			ev: pconfig.ev,
			addon: pconfig.addon
		});

	},
	bind_el: function(pconfig)
	{
		var cls = Array();
		var bbox = !Array.isArray(pconfig.bbox.match(this._config.name)) && pconfig.bbox.trim() != this._config.bbox ? this._config.name+"_"+pconfig.bbox : pconfig.bbox;
		var buffer = document.querySelectorAll("#"+bbox+" *");
		
		if(buffer.length == 0)
			buffer = document.querySelectorAll("#"+this._config.name + "_" +bbox+" *");

		for(var el of buffer)
		{
			var tag = el.tagName.toLowerCase();
			if(tag == "style" || tag == "script") continue;
			if(el.id == null) continue;
			if(el.id.trim() == "") continue;

			var id = el.id.replace(this._config.name+"_", "");
			this.el[id] = el;

			if(el.hasAttribute("class"))
			{
				for(var cl of el.classList)
				{
					if(cls[cl]) continue;
					cls[cl] = cl;
				}
			}
		}

		for(var cl in cls)
		{
			if(cls.hasOwnProperty(cl))
			{
				var nomclass = cl.replace(this._config.name, "");
				
				if(nomclass.trim() == "") continue;
				
				var has_underscore = nomclass[0] == "_" ? true : false;
				nomclass = has_underscore ? nomclass.replace("_", "") : nomclass;
				this.cl[nomclass] = document.getElementsByClassName(this._config.name+(has_underscore ? "_" : "")+nomclass);
			}
		}

		if(pconfig.src)
		{
			if(Array.isArray(pconfig.src))
			{
				for(var a of pconfig.src)
				{
					a.app.bind_el(
						{
							bbox: a.app.el.bbox.id
						});
				}
			}
		}
	},
	render_lb: function(pconfig)
	{
		/*
		name:[string] nombre del lightbox
		bbox:[string] nombre del elemento padre o contenedor
		v:[Array = funciones del view]
		vars: [object] variables que se llaman en las vistas
		uri: url que va a cargar el iframe del lightbox
		w: [string #px | #%] ancho del lightbox
		h: [string #px | #%] alto del lightbox
		load: [function] funcion que retorna una respuesta luego de cargar el lightbox
		*/
		var me = this;
		var config = {
			base: this,
			name: pconfig.name,
			w: pconfig.w,
			h: pconfig.h,
			zindex: pconfig.zindex
		};
		if(pconfig.uri)
			config.uri = pconfig.uri;
		else if(pconfig.v)
		{
			if(Array.isArray(pconfig.v))
			{
				var inner =
				``;
				for(var v of pconfig.v)
				{
					if(this.v[v])
					{
						inner +=
						`${this.v[v](pconfig.vars || {})}`;
					}
				}
			}
		}
		config.view = inner;
		config.load = pconfig.load;
		window.mochi_tbs.tb(config);
	},
	append: function(pconfig)
	{
		/*
		bbox:[string] nombre del elemento padre o contenedor del elemento a crear
		append: [bool] permiso para agregar al dom o no
		tag: [string] tipo de elemento html contenedor
		id: [string] id del elemento a crear
		classes: [Array] clases de estilo del elemento a crear
		styles: [string] secuences of styles for the new element
		v:[Array = funciones del view | string = contenido html]
		ev:[ obj = objects with events ]
		vars: [object] variables que se llaman en c0, c1, c2 y en las vistas
		c0:[Array = funciones del controlador] se invocan antes del render
		c1:[Array = funciones del controlador] se invocan durante el render
		c2:[Array = funciones del controlador] se invocan despues del render
		addon:[string]
		*/

		var el = document.createElement(pconfig.tag || "div");
		el.id = `${this._config.name}_${pconfig.id}`;
		el.setAttribute("style", pconfig.styles || '');

		if(pconfig.classes)
		{
			if(Array.isArray(pconfig.classes))
			{
				var classes = coma = ``;
				for(var c of pconfig.classes)
				{
					classes += `${coma}${this._config.name}_${c}`;
					coma = " ";
				}
				el.setAttribute("class", classes);
			}
		}

		if(pconfig.append)
		{
			this.el[pconfig.bbox].appendChild(el);
			this.el[pconfig.id] = el;

			if(pconfig.v)
			{
				this.render({
					v: pconfig.v,
					bbox: pconfig.id,
					vars: pconfig.vars,
					c0: pconfig.c0,
					c1: pconfig.c1,
					c2: pconfig.c2,
					addon: pconfig.addon,
					ev: pconfig.ev
				});
			}
		}
	},
	load_deps: function(pconfig)
	{
		/*
		pconfig:
		f: [Array / string] ruta del archivo js
		vars: [Object] object with additional variables
		c0:[Array = funciones del controlador] se invocan antes de la carga
		c1:[Array = funciones del controlador] se invocan durante de la carga
		c2:[Array = funciones del controlador] se invocan despues de la carga
		*/

		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars,
			ev: pconfig.ev
		});

		var me = this;

		if(Array.isArray(pconfig.f))
		{
			var l = pconfig.f.length;
			var fc = 0;
			for(var f of pconfig.f)
			{
				var script = document.createElement('script');
				script.onload = function () 
				{


					me.callbacks({
						c: pconfig.c1,
						vars: pconfig.vars,
						ev: pconfig.ev
					});

					fc++;
				    
					if(fc >= l)
					{

						me.callbacks({
							c: pconfig.c2,
							vars: pconfig.vars,
							ev: pconfig.ev
						});
					}

				};
				script.src = f+"?"+Math.random();

				document.head.appendChild(script);


			}
		}else if(typeof(pconfig.f) == "string")
		{
			var script = document.createElement('script');
			script.onload = function () 
			{

				this.callbacks({
					c: pconfig.c1,
					vars: pconfig.vars,
					ev: pconfig.ev
				});

				this.callbacks({
					c: pconfig.c2,
					vars: pconfig.vars,
					ev: pconfig.ev
				});
			};
			script.src = pconfig.f+"?"+Math.random();

			document.head.appendChild(script);
		}
	},
	load_json: function(pconfig)
	{
		/*
		f:[string] file path
		data: [object] variables que se envian al servidor como variables a procesar
		vars: [object] variables que se llaman en c0 y c1
		c0:[Array = funciones del controlador] se invocan antes del post
		c1:[Array = funciones del controlador] se invocan despues del post
		c2:[Array = funciones del controlador] se invocan en la respuesta del post
		*/
		this.callbacks({
			c: pconfig.c0,
			vars: pconfig.vars
		});
		var me = this;

		var xhr = new XMLHttpRequest();
		xhr.open('POST', pconfig.f, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function (p) {
			if(xhr.readyState == 4 && xhr.status == 200)
			{
				resp = JSON.parse(xhr.responseText);
				me.callbacks({
					c: pconfig.c2,
					vars: {args: pconfig.vars, resp: resp}
				});
			}
		};
		xhr.send();

		this.callbacks({
			c: pconfig.c1,
			vars: pconfig.vars
		});
	}
});


mochi_app.create_app = function(config, APP)
{
	if(APP == null || APP == undefined) return;
	var app = new window[APP](config);
	app.run();
	return app;
}

mochi_app.create_addon = function(config, ADDON, run = true)
{
	if(ADDON == null || ADDON == undefined) return;
	var app = new window[ADDON](config);
	if(run)
		app.run();
	return app;
}

mochi_app.add = function(mvc, obj)
{
	Object.assign(mvc, obj);
}
mochi_app.libs = Array();

// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************


mochi_app.d =
{
	today: new Date(),
	ms: [{p: "Ene", f: "Enero", m: 31},
		{p: "Feb", f: "Febrero", m: 28},
		{p: "Mar", f: "Marzo", m: 31},
		{p: "Abr", f: "Abril", m: 30},
		{p: "May", f: "Mayo", m: 31},
		{p: "Jun", f: "Junio", m: 30},
		{p: "Jul", f: "Julio", m: 31},
		{p: "Ago", f: "Agosto", m: 31},
		{p: "Sept", f: "Septiembre", m: 30},
		{p: "Oct", f: "Octubre", m: 31},
		{p: "Nov", f: "Noviembre", m: 30},
		{p: "Dic", f: "Diciembre", m: 31},
	],
	ds: [{p: "Dom", f: "Domingo"},
		{p: "Lun", f: "Lunes"},
		{p: "Mar", f: "Martes"},
		{p: "Mie", f: "Miercoles"},
		{p: "Jue", f: "Jueves"},
		{p: "Vie", f: "Viernes"},
		{p: "Sab", f: "Sabado"}
	],
	Ems: [{p: "Jan", f: "January", m: 31},
		{p: "Feb", f: "February", m: 28},
		{p: "March", f: "March", m: 31},
		{p: "Apr", f: "April", m: 30},
		{p: "May", f: "May", m: 31},
		{p: "Jun", f: "Jun", m: 30},
		{p: "Jul", f: "July", m: 31},
		{p: "Aug", f: "August", m: 31},
		{p: "Sept", f: "September", m: 30},
		{p: "Oct", f: "Octuber", m: 31},
		{p: "Nov", f: "Noviember", m: 30},
		{p: "Dic", f: "Dicember", m: 31},
	],
	Eds: [{p: "Sun", f: "Sunday"},
		{p: "Mon", f: "Monday"},
		{p: "Tue", f: "Tuesday"},
		{p: "Wed", f: "Wednesday"},
		{p: "Thu", f: "Thursday"},
		{p: "Fri", f: "Friday"},
		{p: "Sat", f: "Saturday"}
	],
	date2str: function(date=new Date())
	{
		return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1}-${(date.getDate() < 10 ? '0'+date.getDate() : date.getDate())}`;
	},
	hour2str: function(date=new Date())
	{
		return `${(date.getHours() < 10 ? '0'+date.getHours() : date.getHours())}:${(date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())}:${date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()}`;
	},
	str2date: function(str)
	{
		var split = str.split("-");
		var y = parseInt(split[0]);
		var m = parseInt(split[1]) - 1;
		var d = parseInt(split[2]);

		return new Date(y, m, d);
	},
	is_bisiest: function(date)
	{
		var d = date;
		if(typeof(d) == "string")
			d = this.str2date(d);

		if((d.getFullYear() % 4 == 0) && ((d.getFullYear() % 100 != 0) || (d.getFullYear() % 400 == 0)))
			return true;
		return false;
	}
};


// ************************************************************************************
// ************************************************************************************
// ************************************************************************************
// ************************************************************************************