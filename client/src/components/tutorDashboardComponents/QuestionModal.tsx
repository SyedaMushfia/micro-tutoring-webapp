import React from 'react'
import type { QuestionRow } from '../../types'

interface QuestionModelProps {
    row: QuestionRow;
    onClose: () => void;
    onAccept: (row: QuestionRow) => void;
}

function QuestionModal({ row, onClose, onAccept}: QuestionModelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 sm:w-[600px] xs:w-[400px] shadow-xl max-h-[80vh] overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-[#2e294e] mb-4">
              Question Details
            </h2>
            <p className="text-sm mb-2">
              <span className="font-medium">Subject:</span> {row.subject}
            </p>
            <p className="text-sm mb-2">
              <span className="font-medium">Grade:</span> {row.grade}
            </p>
            <p className="text-sm mb-2">
              <span className="font-medium">Student:</span> {row.student}
            </p>
            <p className="text-sm mt-6">
              <span className="font-medium">Question:</span>
              <br/>
              {row.question}
            </p>
            {row.image && <div className='mt-4 rounded-lg'><img src={row.image} alt="Question Image" className='border-2 rounded-lg' /></div>}
            <div className='flex justify-between'>
              <button className="mt-6 bg-[#d8d2ff] text-[#2e294e] px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-[#d1e674]" onClick={() => onAccept(row)}>
                Accept
              </button>
              <button className="mt-6 bg-[#fdd2d2] text-[#2e294e] px-8 py-2 rounded-xl font-semibold shadow-md hover:bg-red-400" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
  )
}

export default QuestionModal
