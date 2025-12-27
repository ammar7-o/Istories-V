#!/bin/bash
# stop-server.sh

PORT=${1:-8000}

echo "🔴 Stopping server on port $PORT..."

# محاولة Ctrl+C أولاً
if [ -f server.pid ]; then
    PID=$(cat server.pid)
    echo "Sending SIGINT to process $PID..."
    kill -SIGINT $PID 2>/dev/null
    rm server.pid
fi

# إذا لم ينجح، أوقف بالقوة
RUNNING_PID=$(sudo lsof -t -i:$PORT 2>/dev/null)
if [ ! -z "$RUNNING_PID" ]; then
    echo "Force stopping PID: $RUNNING_PID"
    sudo kill -9 $RUNNING_PID 2>/dev/null
fi

echo "✅ Server stopped on port $PORT"
