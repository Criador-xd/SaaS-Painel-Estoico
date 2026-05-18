# Deploy backend to Railway
echo "Installing dependencies..."
cd heartfelt-creations/backend && npm install

echo "Building..."
cd heartfelt-creations/backend && npm run build

echo ""
echo "Next steps:"
echo "  Railway:   railway login && railway init && railway up"
echo "  Render:    push to GitHub + connect render.yaml"
echo "  Vercel:    vercel --cwd heartfelt-creations/backend"
echo ""
echo "After deploy, set VITE_API_URL in Lovable to your backend URL + /api"