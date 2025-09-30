import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { args, request } = ctx;
  const { graphqlApiEndpoint } = ctx.stash;
  const userAgent = createUserAgent(request);

  const selectionSet = 'associatedUserMessageId contentBlockDeltaIndex contentBlockDoneAtIndex contentBlockIndex contentBlockText contentBlockToolUse { toolUseId name input } conversationId id stopReason owner errors { errorType message } p';

  const streamingResponseMutation = {
    name: 'createAssistantResponseStreamChat',
    inputTypeName: 'CreateConversationMessageChatAssistantStreamingInput',
    selectionSet,
  };

  const currentMessageId = ctx.stash.defaultValues.id;

  const modelConfiguration = {
    modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
    systemPrompt: "You are an AI startup assistant for Altura, a platform connecting startups, investors, and job seekers. \n\nYour role is to help startup founders with:\n- Business strategy and growth advice\n- Hiring and team building guidance  \n- Funding and investment strategies\n- Product development and market analysis\n- Networking and partnership opportunities\n\nAlways provide practical, actionable advice tailored to the user's startup stage and industry. Be encouraging but realistic about challenges and opportunities.\n\nWhen discussing funding, consider the user's location and market context. For hiring, focus on practical recruitment strategies and cultural fit.\n\nKeep responses concise but comprehensive, and always ask follow-up questions to better understand their specific needs.",
    inferenceConfiguration: undefined,
  };

  const clientTools = args.toolConfiguration?.tools?.map((tool) => {
    return { ...tool.toolSpec };
  });
  const dataTools = undefined;
  const toolsConfiguration = { dataTools, clientTools };

  const messageHistoryQuery = {
    getQueryName: 'getConversationMessageChat',
    getQueryInputTypeName: 'ID',
    listQueryName: 'listConversationMessageChats',
    listQueryInputTypeName: 'ModelConversationMessageChatFilterInput',
    listQueryLimit: undefined,
  };

  const authHeader = request.headers['authorization'];
  const payload = {
    conversationId: args.conversationId,
    currentMessageId,
    responseMutation: streamingResponseMutation,
    graphqlApiEndpoint,
    modelConfiguration,
    request: {
      headers: {
        authorization: authHeader,
        'x-amz-user-agent': userAgent,
      }
    },
    messageHistoryQuery,
    toolsConfiguration,
    streamResponse: true,
  };

  return {
    operation: 'Invoke',
    payload,
    invocationType: 'Event',
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.appendError(ctx.error.message, ctx.error.type);
  }
  const response = {
    __typename: 'ConversationMessageChat',
    id: ctx.stash.defaultValues.id,
    conversationId: ctx.args.conversationId,
    role: 'user',
    content: ctx.args.content,
    aiContext: ctx.args.aiContext,
    toolConfiguration: ctx.args.toolConfiguration,
    createdAt: ctx.stash.defaultValues.createdAt,
    updatedAt: ctx.stash.defaultValues.updatedAt,
  };
  return response;
}

function createUserAgent(request) {
  const packageMetadata = 'amplify-graphql-conversation-transformer#1.1.12';
  let userAgent = request.headers['x-amz-user-agent'];
  if (userAgent) {
    userAgent = `${userAgent} md/${packageMetadata}`;
  } else {
    userAgent = `lib/${packageMetadata}`;
  }
  return userAgent;
}