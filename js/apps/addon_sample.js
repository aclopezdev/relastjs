var Addon_Sample = new Class(
	{
		Extends: mochi_addon,
		initialize: function(pconfig)
		{
			this.parent(pconfig, Addon_Sample, this);
		},
		run: function()
		{
			this.run_me();
			return this;
		}
	});




Addon_Sample.controller =
{
	main_addon: function()
	{
		this.addon.render({
			bbox: this.addon._config.bbox,
			v: ["styles_addon", "main_addon"],
			c2: []
		});
	}
};




Addon_Sample.model =
{

};



Addon_Sample.view =
{
	main_addon: function()
	{
		var inner = 
		``;
		return inner;
	},
	styles_addon: function()
	{
		var inner =
		`<style>
		</style>`;
		return inner;
	}
}


		