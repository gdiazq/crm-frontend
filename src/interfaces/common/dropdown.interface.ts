export interface DropdownAction {
  id: string
  label: string
  tone?: 'default' | 'danger'
  handler: () => void
}
