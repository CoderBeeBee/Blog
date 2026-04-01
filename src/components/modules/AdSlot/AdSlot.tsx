import { useWatch, useFormContext } from 'react-hook-form'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import RHFCheckbox from '../../atoms/RHFCheckbox/RHFCheckbox'
import SwitchButton from '../../atoms/SwitchButton/SwitchButton'

interface AdSlotProps {
	styles: Record<string, string>
	slot: Record<string, string >
    isSubmitting:boolean
}

const AdSlot = ({ slot, styles,isSubmitting }: AdSlotProps) => {
	const { control } = useFormContext()

	const enabled = useWatch({
		control,
		name: `slots.${slot.key}.enableAd`,
	})

	return (
		<div key={slot.key}>
			<RHFInput
				styles={styles}
				type="text"
				name={`slots.${slot.key}.slot`}
				label={slot.label}
				id={`slots.${slot.key}.slot`}
				isSubmitting={isSubmitting}
			/>
			<RHFCheckbox
				name={`slots.${slot.key}.enableAd`}
				id={`slots.${slot.key}.enableAd`}
				label="Enable Ad"
				styles={styles}
				isSubmitting={isSubmitting}>
				<SwitchButton switchButton={enabled} isSubmitting={isSubmitting} />
			</RHFCheckbox>
		</div>
	)
}

export default AdSlot
