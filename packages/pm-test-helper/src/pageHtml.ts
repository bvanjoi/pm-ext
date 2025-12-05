import fs from 'node:fs/promises'

export async function pageHtml(): Promise<string> {
	let filePath = import.meta.resolve('@pm-ext/e2e-helper')
	if (filePath.startsWith('file://')) {
		filePath = filePath.slice(7)
	}
	const content = await fs.readFile(filePath, 'utf-8')
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> Editor Test </title>
</head>
<body>
	
	<script>
${content}

window.setupEditor();
	</script>

</body>
</html>	
`
}
