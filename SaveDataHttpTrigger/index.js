const {{ BlobServiceClient }} = require("@azure/storage-blob");

module.exports = async function (context, req) {{
    try {{
        const {{ name, task }} = req.body;
        if (!name || !task) {{
            context.res = {{
                status: 400,
                body: "Please provide both name and task in the request body."
            }};
            return;
        }}
        const connectionString = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient("data");
        await containerClient.createIfNotExists();

        const timestamp = Date.now();
        const fileName = `${{timestamp}}_${{name}}.json`;
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const content = JSON.stringify({{ name, task }});
        await blockBlobClient.upload(content, Buffer.byteLength(content));

        context.res = {{
            status: 200,
            body: {{ message: `File uploaded as ${{fileName}}` }}
        }};
    }} catch (error) {{
        context.log.error("Error uploading to blob:", error);
        context.res = {{
            status: 500,
            body: "Error uploading the file."
        }};
    }}
}};