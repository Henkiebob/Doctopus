

module.exports = {
	// --------------------------------------------------
	// Some dummy data to test without database
	// --------------------------------------------------
	blocks: [
		{ "id": '51c992b0eea60b364f000002', "content": "Welkom bij Doctopus.", "cols": 4, "type": "text" },
		{ "id": 2, "content": "We hebben een paar kleine opdrachten voor jou. Deze staan hier onder beschreven.", "cols": 1, "type": "text" },
		{ "id": 3, "content": [
			"1. Maak een nieuw blok.",
			"2. Verander het nieuwe blok in een tekst blok",
			"3. Typ de tekst: 'De kat krabt de krullen van de trap.' in het tekst blok.",
			"4. Maak de door jou getypte tekst 'dik gedrukt en cursief'", 
			"5. Vergroot het tekst blok naar een breedte van 3 kolommen.",
			"6. Verander de kleur van de tekst naar blauw.",
			"7. Sla jou wijzigingen op!",
			"8. Verwijder de titel van dit document.",
			"9. Zet de door jou getypte tekst rechts-boven aan de pagina.",
			"10. Gefeliciteerd, de test zit er op! Bedankt voor het testen van Doctopus!",
		], "cols": 4, "type": "list" },
		{"id": 4, "content": [
			  "Sortable tolerance: pointer"
			, "Label maken van sidebar opties"
			, "Textarea"
			, "Kleur wijzigen binnen texteditor"
			, "Save- en Cancel-knop achter BUIS in YellowText"
			, "Geselecteerd blok kunnen weggooien"
			, "Title attributen toevoegen aan sidecar elementen"
			, "Notification area weghalen"
			, "Title attributen toevoegen waar nodig"
			, "Sidebarcontent dynamisch op wat je hebt geselecteerd"
			, "New events:"
			, "Single click: Select + show handlebar:"
			, "Edit"
			, "Drag"
			, "Double click: immediate edit"
			, "Deselecteren van blokken"
			, "Notification slide down onder de menu baren verwacht in het veld zelf"
			, "tekstkleur nog wel updaten"
		], "cols": 4, "type": "list"}
	],
	// --------------------------------------------------
	// Default document styling, this needs to be saved
	// to the database when creating a new document.
	// --------------------------------------------------
	current: {
		'p': {
			'font_size': '14px',
			'color': '#000000',
			'font_family': 'arial'
		},
		'ul': {
			'font_size': '14px',
			'color': '#000000',
			'font_family': 'arial'
		},
		'li': {
			'list_style_type': 'disc'
		}
	},
	// --------------------------------------------------
	// Options for the select/input fields
	// --------------------------------------------------
	options: {
		'fonts': {
			'arial': 'Arial',
			'comic sans ms': 'Comic Sans MS',
			'monospace': 'Monospace',
			'verdana': 'Verdana',
			'ubuntu': 'Ubuntu'
		},
		'list_style_types': {
			'circle': 'Circle',
			'disc': 'Disc',
			'square': 'Square',
			'none': 'None'
		}
	}
}