echo "🏥 Running health checks..."

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/ || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed (Status: $FRONTEND_STATUS)"
    exit 1
fi

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3101/health || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed (Status: $BACKEND_STATUS)"
    exit 1
fi

echo "🎉 All health checks passed!"