echo ${{ vars.PROJECT_ROOT }}
echo $PROJECT_ROOT
cd $PROJECT_ROOT
git pull
tmux new-session -A -s banners_tracker
