# Maintainer: SoulHarsh007 <harsh.peshwani@outlook.com>
pkgname="rebornos-fire"
_pkgname="rebornos-fire"
pkgver=1.0.0.rc.4
_pkgver=1.0.0
pkgver() {
  _ver="$(cat ${srcdir}/package.json | sed -En "s/  \"version\": \"(.*)\",/\1/p")"
  echo "${_ver//-/.}"
}
pkgrel=1
_pkg="linux-unpacked"
pkgdesc="Management utility for RebornOS"
arch=('x86_64')
url="https://rebornos.org/"
license=('GPL3')
depends=('libnotify' 'polkit')
source=("fire.desktop" "kernelmanager.desktop" "LICENSE" "fire.svg" "package.json" "fire.config.yaml")
source_x86_64=("${_pkg}.tar.gz")
sha256sums=(
  'ea20e3b8bde64a4e5befbfaadda50bcf38a90ebaa9d863bb5e348ae75cfdf1c5'
  '1398d69743fbc4ebebe0111dfe07daa86649d2eb98ccbbb66cd7a0aa5deaa1ae'
  '4257c04bf65197b0282d1a0105d01d9b273153f7dee1588bdf52dc9071618de7'
  '5f0db1f929b6b76a5291ea1b90c4307d30b7e8605ab56d267790214291640c05'
  'SKIP'
  'SKIP'
)
sha256sums_x86_64=('SKIP')

package() {
  install -d "${pkgdir}/opt"
  install -d "${pkgdir}/usr/bin"
  install -d "${pkgdir}/usr/share"
  install -d "${pkgdir}/usr/share/applications"
  install -d "${pkgdir}/usr/share/icons"
  install -d "${pkgdir}/usr/share/pixmaps"
  install -d "${pkgdir}/usr/share/licenses"
  install -d "${pkgdir}/usr/share/doc"
  install -d "${pkgdir}/usr/share/doc/${_pkgname}"
  install -d "${pkgdir}/opt/${_pkgname}"
  install -d "${pkgdir}/usr/share/licenses/${_pkgname}"
  install -m644 "${srcdir}/LICENSE" "${pkgdir}/usr/share/licenses/${_pkgname}/LICENSE"
  install -m644 "${srcdir}/fire.config.yaml" "${pkgdir}/usr/share/doc/${_pkgname}/fire.config.yaml"
  install -m644 "${srcdir}/fire.svg" "${pkgdir}/usr/share/pixmaps/fire.svg"
  install -m644 "${srcdir}/fire.svg" "${pkgdir}/usr/share/icons/fire.svg"
  install -m644 "${srcdir}/fire.desktop" "${pkgdir}/usr/share/applications/${_pkgname}.desktop"
  install -m644 "${srcdir}/kernelmanager.desktop" "${pkgdir}/usr/share/applications/kernelmanager.desktop"
  cp -r "${srcdir}/${_pkg}/"* "${pkgdir}/opt/${_pkgname}" -R
  ln -s /opt/${_pkgname}/fire "${pkgdir}"/usr/bin/rebornos-fire
}
