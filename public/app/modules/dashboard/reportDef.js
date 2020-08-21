module.exports = {
	content: [
		{ text: 'We sometimes don\'t know the absolute position of text', margin: [10, 0, 0, 50] },
		{
			columns: [
				{ width: '50%', text: 'horizontal position is not known either' },
				{ width: '50%', stack: chart }
			]
		},
		{ text: 'We can position relative with center and right alignment', margin: [0, 50, 0, 50] },
		{
			table: {
				widths: [100, 100, 100],
				body: [
					['Column with a lot of text. Column with a lot of text. Column with a lot of text. Column with a lot of text.',
						{
							text: 'I\'m aligned center',
							style: {
								alignment: 'center',
							},
							relativePosition: {
								x: 0,
								y: 25,
							}
						},
						{
							text: 'I\'m aligned right',
							style: {
								alignment: 'right',
							},
							relativePosition: {
								x: 0,
								y: 25,
							}
						}]
				]
			}
		}
	]
}