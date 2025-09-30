import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { recommendationFunctionHandler } from './functions/recommendation/resource';

defineBackend({
  auth,
  data,
  recommendationFunctionHandler,  
});
