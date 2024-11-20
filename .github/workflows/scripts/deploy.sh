echo $PROJECT_ROOT
cd $PROJECT_ROOT
git pull
tmux new-session -A -s banners_tracker
# install dependencies for frontend and backend
yarn build:ci
# restart pm2
pm2 restart app