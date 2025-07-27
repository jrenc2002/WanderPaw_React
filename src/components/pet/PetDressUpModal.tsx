import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

// 装扮类型接口
export interface DressUpItem {
  id: string
  name: string
  nameEn: string
  image: string
  type: 'hat' | 'accessory' | 'background'
}

// 弹窗属性接口
interface PetDressUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedItem: DressUpItem | null) => void
  currentItem?: DressUpItem | null
  petName: string
}

// 可用的装扮列表
const availableDressUps: DressUpItem[] = [
  {
    id: 'hand_roast',
    name: '手工烘焙',
    nameEn: 'Hand Roast',
    image: '/decorations/hand_roast.png',
    type: 'accessory'
  },
  {
    id: 'mountain',
    name: '富士山',
    nameEn: 'Mount Fuji',
    image: '/decorations/mountain.png',
    type: 'background'
  },
  {
    id: 'leaf_tag',
    name: '叶子标签',
    nameEn: 'Leaf Tag',
    image: '/decorations/leaf_tag.png',
    type: 'accessory'
  },
  {
    id: 'chinese_knot',
    name: '中国结',
    nameEn: 'Chinese Knot',
    image: '/decorations/chinese_knot.png',
    type: 'accessory'
  },
  {
    id: 'green_tea',
    name: '绿茶',
    nameEn: 'Green Tea',
    image: '/decorations/green_tea.png',
    type: 'accessory'
  },
  {
    id: 'cat_dog_hug',
    name: '猫狗拥抱',
    nameEn: 'Cat & Dog Hug',
    image: '/decorations/cat_dog_hug.png',
    type: 'background'
  }
]

const PetDressUpModal: React.FC<PetDressUpModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentItem,
  petName
}) => {
  const [language] = useAtom(selectedLanguageAtom)
  const [selectedItem, setSelectedItem] = useState<DressUpItem | null>(currentItem || null)

  const handleItemSelect = (item: DressUpItem) => {
    setSelectedItem(item)
  }

  const handleSave = () => {
    onSave(selectedItem)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'rgba(92, 90, 76, 0.15)',
            backdropFilter: 'blur(9.399999618530273px)'
          }}
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[80vw] max-w-2xl relative"
            style={{
              background: '#FEFDF9',
              borderRadius: '2vw',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 装饰性回形针 */}
            <div className="absolute -top-2 -right-2 w-8 h-8">
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(45deg, #8FBC8F, #90EE90)',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              ></div>
            </div>

            {/* 内容区域 */}
            <div className="p-8">
              {/* 标题 */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#687949' }}
                >
                  {language === 'zh' 
                    ? `为【${petName}】添加装扮`
                    : `Add dressing up for [${petName}]`
                  }
                </h2>
                <p
                  className="text-sm"
                  style={{ color: '#A6A196' }}
                >
                  {language === 'zh' 
                    ? '返回相片中的宠物形象也会更改'
                    : 'The pet image in the returned photo will also change'
                  }
                </p>
              </div>

              {/* 装扮选择区域 */}
              <div className="mb-8">
                <div className="flex justify-center gap-4 mb-4">
                  {availableDressUps.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                        selectedItem?.id === item.id
                          ? 'ring-2 ring-[#687949] ring-offset-2'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.image}
                          alt={language === 'zh' ? item.name : item.nameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p
                        className="text-xs text-center mt-2"
                        style={{ color: '#687949' }}
                      >
                        {language === 'zh' ? item.name : item.nameEn}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* 选择指示器 */}
                <div className="flex justify-center">
                  <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: '#687949' }}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: selectedItem 
                          ? `${((availableDressUps.findIndex(item => item.id === selectedItem.id) + 1) / availableDressUps.length) * 100}%`
                          : '0%'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* 按钮区域 */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{
                    background: '#F5F5DC',
                    color: '#687949'
                  }}
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105"
                  style={{
                    background: '#687949'
                  }}
                >
                  {language === 'zh' ? '保存装扮' : 'Save Dressing Up'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PetDressUpModal 