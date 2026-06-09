import PartnershipForm from './PartnershipForm';
import MeetingForm from './MeetingForm';

export default function AdminItemForm({ activeTab, editItem, formData, setFormData, handleSave, setShowForm, roleColor, members, clients }) {
    const commonProps = { formData, setFormData, handleSave, setShowForm, editItem, roleColor, members };

    switch (activeTab) {
        case 'partnership':
            return <PartnershipForm {...commonProps} />;
        case 'meetings':
            return <MeetingForm {...commonProps} clients={clients} />;
        default:
            return null;
    }
}
