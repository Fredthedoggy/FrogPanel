while true; do
  cd /var/www/pterodactyl || exit
  echo " To See All Available Patches, See https://github.com/Fredthedoggy/frogpanel/tree/addons/Patches"
  PATCHIN=""
  PATCH=""
  read -p " Select Patch by Name: " PATCHIN
  PATCH=${PATCHIN%.patch}
  if ! curl --fail https://raw.githubusercontent.com/Fredthedoggy/frogpanel/addons/Patches/${PATCH}.patch >/dev/null 2>&1; then
    echo " Invalid Patch. Aborting."
    break
  fi
  if ! command -v git >/dev/null 2>&1; then
    echo " Git Is Missing Aborting."
    break
  fi
  curl https://raw.githubusercontent.com/Fredthedoggy/frogpanel/addons/Patches/${PATCH}.patch | git apply -v
  if ! command -v npm >/dev/null 2>&1; then
    if ! command -v apt >/dev/null 2>&1; then
      echo "Non Debian/Ubuntu System Detected. Please Rebuild Assets Manually https://pterodactyl.io/community/customization/panel.html"
      break
    fi
    echo "Installing NPM"
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    apt install -y nodejs
  fi
  if ! command -v yarn >/dev/null 2>&1; then
    echo "Installing Yarn"
    npm i -g yarn 2>&1
  fi
  yarn
  yarn build:production
done
