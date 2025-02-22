import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import re
import redis
import json

# .env 파일 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # 모든 도메인에 대해 CORS 허용
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))  # 환경변수에서 API 키를 가져옵니다.

if client is None:
    raise ValueError("API key is missing from environment variables")

# 정적인 Assistant ID 설정
ASSISTANT_ID = os.getenv("ASSISTANT_ID")
THREAD_ID = None

# Redis 설정
redis_client = redis.StrictRedis(host=os.environ.get("REDIS_HOST", "localhost"),
                                  port=6379, db=0, decode_responses=True)

def get_thread_from_redis(thread_id):
    """Redis에서 스레드 정보를 가져오고 JSON에서 dict로 변환."""
    thread_data = redis_client.get(thread_id)
    if thread_data:
        try:
            thread_data = json.loads(thread_data)  # 문자열을 dict로 변환
            print(f"Thread found in Redis: {thread_data}")
            return thread_data
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from Redis: {e}")
            return None
    return None

def save_thread_to_redis(thread_id, data):
    """Redis에 스레드 정보를 JSON 문자열로 변환하여 저장."""
    try:
        json_data = json.dumps(data)  # dict를 JSON 문자열로 변환
        redis_client.set(thread_id, json_data, ex=600)  # 10분 동안 캐시 저장
        print(f"Thread saved to Redis: {json_data}")
    except Exception as e:
        print(f"Error saving thread to Redis: {e}")

@app.route('/AIChat', methods=['OPTIONS', 'POST'])
def handle_chat():
    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight response"})
        
        # 요청한 Origin 값을 그대로 반영
        origin = request.headers.get('Origin')
        if origin:
            response.headers.add('Access-Control-Allow-Origin', origin)
        
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.status_code = 200  # HTTP OK 상태 코드 추가
        return response

    return submit_message()

def submit_message():
    global THREAD_ID

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    print(f"User message: {user_message}")  # 메시지 확인

    try:
        if THREAD_ID:
            # Redis에서 기존 스레드 ID 확인
            thread_data = get_thread_from_redis(THREAD_ID)
            if thread_data:
                print(f"Thread data found in Redis: {thread_data}")
            else:
                print("Thread not found in Redis, retrieving from OpenAI.")
                try:
                    thread = client.beta.threads.retrieve(thread_id=THREAD_ID)
                    print(f"Thread found in OpenAI: {thread}")
                except Exception as e:
                    print(f"Error retrieving thread, creating a new one: {e}")
                    THREAD_ID = create_new_thread(user_message)
        else:
            # 스레드 ID가 없으면 새 스레드 생성
            THREAD_ID = create_new_thread(user_message)

        # 기존 스레드 ID와 Assistant ID를 사용하여 실행 준비
        run = client.beta.threads.runs.create(
            thread_id=THREAD_ID,
            assistant_id=ASSISTANT_ID,
        )

        # 실행 대기
        run = wait_on_run(run)

        # 실행이 완료되면 응답을 반환합니다.
        response = get_response()

        # Redis에 스레드 정보 캐시
        save_thread_to_redis(THREAD_ID, response)

        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

def create_new_thread(user_message):
    """새로운 스레드를 생성하고 첫 번째 메시지를 추가합니다."""
    try:
        new_thread = client.beta.threads.create()
        thread_id = new_thread.id
        print(f"New thread created with ID: {thread_id}")

        # 사용자 메시지를 새 스레드에 추가
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message,
        )

        return thread_id
    except Exception as e:
        raise RuntimeError(f"Failed to create new thread: {e}")

def wait_on_run(run, timeout=60):
    """실행 완료까지 대기하는 함수"""
    start_time = time.time()

    while run.status in ["queued", "in_progress"]:
        if time.time() - start_time > timeout:
            raise TimeoutError("The operation timed out waiting for the run to complete.")
        
        run = client.beta.threads.runs.retrieve(
            thread_id=THREAD_ID,
            run_id=run.id,
        )
        time.sleep(0.5)

    if run.status not in ["completed", "failed"]:
        raise ValueError(f"Unexpected run status: {run.status}")

    return run

def get_response():
    """기존 스레드에서 메시지를 가져옴"""
    messages_page = client.beta.threads.messages.list(thread_id=THREAD_ID, order="asc")
    messages = []

    if messages_page and hasattr(messages_page, 'data') and messages_page.data:
        for message in messages_page.data:
            content = extract_content(message.content)
            print(content)
            messages.append({"role": message.role, "content": content})
    else:
        print("No messages found in the thread.")

    return {"messages": messages}

def extract_value_from_str(content):
    match = re.search(r"value='(.*?)'", str(content))
    if match:
        value = match.group(1).replace(r'\n', "\n")
        value = re.sub(r'【.*?】', '', value)
        return value
    return ""

def extract_content(content):
    print(f"Content object: {content}")
    return extract_value_from_str(content)

if __name__ == "__main__":
    app.run(debug=True)
