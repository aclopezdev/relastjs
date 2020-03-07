var Main_app = new Class(
	{
		Extends: mochi_app,
		initialize: function(pconfig)
		{
			this.parent(pconfig, Main_app, this);
		},
		run: function()
		{
			this.parent_run();
			this.execc(
				{
					c: ["main", "main_theme"]
				});
		}
	});




Main_app.controller =
{
	main: function()
	{
		this.app.execc({ c: "create_view" });
	},
	create_view: function()
	{
		this.app.create_view(
			{
				name: "MochiMain_app",
				v: ["styles", "my_styles", "main", "main_theme"],
				c2: [],
				ev: {
				}
			});
	}
};




Main_app.model =
{

};



Main_app.view =
{
	main: function()
	{
		var inner =
		``;
		return inner;
	},
	styles: function()
	{
		var inner =
		`<style>
		</style>`;
		return inner;
	}
}


		