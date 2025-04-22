

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}
export const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}: ModalProps)=> {
    if (!isOpen) return null
    return (
        <div className=" fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 " onClick={onClose}>
            <div className=" rounded-lg shadow-md bg-white max-w-[100vw] max-h-[100vh]"  onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        
        </div>
    )
}