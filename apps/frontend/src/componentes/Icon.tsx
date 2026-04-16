/**
 * Componente Icon — wrapper centralizado de Iconify
 *
 * Uso:
 *   import Icon from '@/componentes/Icon'
 *   <Icon name="mdi:home" />
 *   <Icon name="lucide:arrow-right" size={24} className="text-red-500" />
 *
 * Colecciones populares:
 *   mdi:          Material Design Icons
 *   lucide:       Lucide
 *   tabler:       Tabler Icons
 *   heroicons:    Heroicons
 *   ph:           Phosphor Icons
 *   ri:           Remix Icon
 *
 * Documentación: https://icon-sets.iconify.design
 */

import { Icon as IconifyIcon } from '@iconify/react'

interface IconProps {
  /** Nombre del icono en formato "coleccion:nombre", ej: "mdi:home" */
  name: string
  /** Tamaño en px (ancho y alto). Default: 20 */
  size?: number
  /** Color CSS. Por defecto hereda currentColor */
  color?: string
  /** Clases adicionales de CSS/Tailwind */
  className?: string
  /** Estilos inline adicionales */
  style?: React.CSSProperties
  /** Accesibilidad: etiqueta aria-label */
  label?: string
}

export default function Icon({
  name,
  size = 20,
  color,
  className,
  style,
  label,
}: IconProps) {
  return (
    <IconifyIcon
      icon={name}
      width={size}
      height={size}
      color={color}
      className={className}
      style={style}
      aria-label={label}
      aria-hidden={!label}
    />
  )
}
