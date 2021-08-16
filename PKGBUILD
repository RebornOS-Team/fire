# Maintainer: SoulHarsh007 <harshtheking@hotmail.com>
pkgname="rebornos-fire"
_pkgname="rebornos-fire"
pkgver=1.0.0
_pkgver=1.0.0
pkgrel=1
_pkg="linux-unpacked"
pkgdesc="Management utility for RebornOS"
arch=('x86_64')
url="https://rebornos.org/"
license=('GPL3')
depends=('libnotify' 'polkit')
source=("fire.desktop" "LICENSE" "fire.svg")
source_x86_64=("${_pkg}.tar.gz")
sha256sums=('cd1ae26dccdf81bf8f1c11c5dcca9c07de116cc9d7d2f6a82fbce57424e244a6'
  '4257c04bf65197b0282d1a0105d01d9b273153f7dee1588bdf52dc9071618de7'
  '5f0db1f929b6b76a5291ea1b90c4307d30b7e8605ab56d267790214291640c05')
sha256sums_x86_64=('SKIP')

package() {
  install -d "${pkgdir}/usr/share/licenses/${_pkgname}"
  install -d "${pkgdir}/opt/${_pkgname}"
  install -d "${pkgdir}/usr/bin"
  install -d "${pkgdir}/usr/share/applications"
  install -d "${pkgdir}/usr/share/icons"
  install -d "${pkgdir}/usr/share/pixmaps"
  install -m644 "${srcdir}/LICENSE" "${pkgdir}/usr/share/licenses/${_pkgname}/LICENSE"
  install -m644 "${srcdir}/fire.svg" "${pkgdir}/usr/share/pixmaps/fire.svg"
  install -m644 "${srcdir}/fire.desktop" "${pkgdir}/usr/share/applications/${_pkgname}.desktop"
  cp -r "${srcdir}/${_pkg}/"* "${pkgdir}/opt/${_pkgname}" -R
  ln -s /opt/${_pkgname}/fire "${pkgdir}"/usr/bin/rebornos-fire
}
