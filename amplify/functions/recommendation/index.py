import json
import os
import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
region =  'us-west-2'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    region,
    service,
    session_token=credentials.token
)

# OpenSearch client
host = "https://search-altura-vectorstore-dpqh4m5hqubek4wo3po7z4cyyq.us-west-2.es.amazonaws.com"
opensearch_client = OpenSearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    timeout=30
)

def neural_search(text_query, index_name, model_id, k=5):
    """
    Search using neural query - OpenSearch will vectorize the text automatically
    using the connected SageMaker endpoint
    """
    try:
        search_body = {
            'size': k,
            '_source': True,
            'query': {
                'neural': {
                    'embedding_vector': {
                        'query_text': text_query,
                        'model_id': model_id,
                        'k': k
                    }
                }
            }
        }
        
        response = opensearch_client.search(
            index=index_name,
            body=search_body
        )
        
        results = [
            {
                'id': hit['_id'],
                'score': hit['_score'],
                'text': hit['_source'].get('text'),
                'metadata': hit['_source'].get('metadata', {})
            }
            for hit in response['hits']['hits']
        ]
        
        return results
        
    except Exception as e:
        print(f"Error in neural search: {str(e)}")
        raise

def upsert_document(doc_id, text, index_name, metadata=None):
    """
    Upsert document - OpenSearch will automatically vectorize using 
    the ingest pipeline connected to SageMaker
    """
    try:
        document = {
            'text': text,
            'metadata': metadata or {},
            'timestamp': context.aws_request_id if 'context' in globals() else None
        }
        
        # Use the ingest pipeline that has the text_embedding processor
        response = opensearch_client.index(
            index=index_name,
            id=doc_id,
            body=document,
            pipeline='neural-ingest-pipeline',  # Your pipeline name
            refresh=True
        )
        
        return {
            'id': response['_id'],
            'result': response['result'],
            'version': response['_version']
        }
        
    except Exception as e:
        print(f"Error upserting document: {str(e)}")
        raise

def handler(event, context):
    """
    Main handler: Neural Search -> Upsert
    OpenSearch handles vectorization automatically via SageMaker
    """
    try:
        # Parse request
        body = json.loads(event.get('body', '{}'))
        
        text_input = body.get('text')
        doc_id = body.get('id')
        index_name = body.get('indexName', 'neural-search-index')
        model_id = body.get('modelId')  # Your SageMaker model ID in OpenSearch
        metadata = body.get('metadata', {})
        top_k = body.get('topK', 5)
        
        # Validation
        if not text_input:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'text is required'})
            }
        
        if not model_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'modelId is required'})
            }
        
        # Step 1: Neural search for top K similar documents
        # OpenSearch automatically vectorizes text_input using SageMaker
        print(f"Performing neural search for: {text_input[:100]}...")
        similar_results = neural_search(text_input, index_name, model_id, k=top_k)
        
        # Step 2: Upsert the document
        # OpenSearch automatically vectorizes via ingest pipeline
        # print(f"Upserting document...")
        # upsert_result = upsert_document(
        #     doc_id=doc_id,
        #     text=text_input,
        #     index_name=index_name,
        #     metadata=metadata
        # )
        
        # Return results
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'similarDocuments': similar_results,
                # 'upsertResult': upsert_result
            })
        }
        
    except Exception as e:
        print(f"Error in handler: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e),
                'type': type(e).__name__
            })
        }