interface IConfirmModal {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: ( event: React.FormEvent<HTMLFormElement>) => Promise<void> ;
    title: string;
    message: string;
}

export const ConfirmModal: React.FC<IConfirmModal> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <form onSubmit={onConfirm}
        className="fixed inset-0  flex justify-center items-center z-50">
            <div className="bg-black p-4 rounded-lg shadow-md text-center flex flex-col items-center">
                <h2 className="text-white text-lg font-semibold mb-2 tracking-wide">{title}</h2>
                <p className="text-white">{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-900 transition duration-300 ease-in-out hover:bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
                        type="button"
                    >
                        Cancelar
                    </button>
                    <button 
                        className="bg-zinc-900 hover:bg-zinc-800 transition duration-300 ease-in-out text-white px-4 py-2 rounded-md"
                        type="submit"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </form>    
    );
}