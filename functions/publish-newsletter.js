const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event) => {
  try {
    const snsClient = new SNSClient({ region: process.env.AWS_REGION });

    if (process.env.IS_OFFLINE) {
      snsClient.endpoint = process.env.SNS_ENDPOINT_LOCAL; // Caso esteja rodando offline, utilize esse endpoint
    }

    const { subject, introduction, recipes } = JSON.parse(event.body); // Obtenha informações do corpo da requisição, como o título do e-mail, introdução e receitas

    const params = {
      Message: JSON.stringify({ subject, introduction, recipes }),
      TopicArn: process.env.SNS_ARN,
    }; // Alguns parâmetros que serão passados para o tópico, como a mensagem a ser enviada e o ARN do TÓPICO (um identificador do tópico)

    const publishCommand = new PublishCommand(params);

    await snsClient.send(publishCommand); // Publique essas informações no tópico

    console.log("PUBLISH_NEWSLETTER");

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
