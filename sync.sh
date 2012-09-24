echo ''
echo './*'
rsync -ruvzl --exclude '.svn/*' -e ssh ./* root@91.193.1.53:/www/tools/jafw/
