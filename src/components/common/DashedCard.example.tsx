import React from 'react';
import DashedCard from './DashedCard';

const DashedCardExample: React.FC = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>DashedCard 组件使用示例</h2>
      
      {/* 示例1: 固定宽高 */}
      <DashedCard width="300px" height="200px">
        <div style={{ textAlign: 'center' }}>
          <h3>示例1</h3>
          <p>固定宽高 300px × 200px</p>
        </div>
      </DashedCard>

      {/* 示例2: 百分比宽度 */}
      <DashedCard width="100%" height="150px">
        <div style={{ textAlign: 'center' }}>
          <h3>示例2</h3>
          <p>100% 宽度，150px 高度</p>
        </div>
      </DashedCard>

      {/* 示例3: 内容自适应高度 */}
      <DashedCard width="400px">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>示例3</h3>
          <p>内容自适应高度</p>
          <p>这里有更多内容...</p>
          <button style={{ marginTop: '10px', padding: '8px 16px' }}>
            按钮示例
          </button>
        </div>
      </DashedCard>

      {/* 示例4: 自定义样式 */}
      <DashedCard 
        width="350px" 
        height="180px"
        className="custom-card"
        style={{ margin: '10px auto' }}
      >
        <div style={{ textAlign: 'center', color: '#8B4513' }}>
          <h3>示例4</h3>
          <p>自定义样式和居中</p>
        </div>
      </DashedCard>
    </div>
  );
};

export default DashedCardExample; 