export default function ConfirmationPrompt({isEdit, close}){
    return (
    <div className="fixed inset-0 bg-astrablack/60 flex items-center justify-center z-100">
        <div className="bg-astrawhite max-w-[600px] w-19/20 min-h-[100px] h-auto rounded-2xl p-7 pb-5">

            <h1 className="text-astrablack text-xl font-normal">Are you sure you want to {isEdit ? "edit": "delete"} this job posting?</h1>

            <div className="flex gap-4 mt-3">
                <button className="text-astrawhite border-1 border-astraprimary bg-astraprimary font-semibold w-16 py-2 rounded-lg text-lg">Yes</button>
                <button onClick={close} className="text-astraprimary border-1 border-astraprimary font-semibold w-17 py-2 rounded-lg text-lg">No</button>
            </div>

        </div>
    </div>
  )}
  