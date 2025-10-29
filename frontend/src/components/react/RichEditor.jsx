import React, { useState, useEffect, useRef } from 'react';

const RichEditor = ({ value = '', onChange, placeholder = '开始编辑...', config = {} }) => {
  const [content, setContent] = useState(value);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  
  // 当外部value变化时更新内部状态
  useEffect(() => {
    setContent(value);
  }, [value]);
  
  // 当内部内容变化时通知外部
  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };
  
  // 执行格式化命令
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange(editorRef.current.innerHTML);
  };
  
  // 处理编辑器内容变化
  const handleEditorInput = () => {
    handleContentChange(editorRef.current.innerHTML);
  };
  
  // 插入图片
  const insertImage = () => {
    const url = prompt('请输入图片URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };
  
  // 插入链接
  const insertLink = () => {
    const url = prompt('请输入链接URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };
  
  // 清除格式
  const clearFormat = () => {
    execCommand('removeFormat');
  };
  
  return (
    <div className="rich-editor-container">
      {/* 工具栏 */}
      <div className="editor-toolbar" ref={toolbarRef}>
        {/* 文本格式 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('formatBlock', '<h1>')}
            title="标题1"
          >
            H1
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="标题2"
          >
            H2
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('formatBlock', '<p>')}
            title="段落"
          >
            P
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        {/* 文本样式 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('bold')}
            title="粗体"
          >
            <strong>B</strong>
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('italic')}
            title="斜体"
          >
            <em>I</em>
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('underline')}
            title="下划线"
          >
            U
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('strikeThrough')}
            title="删除线"
          >
            S
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        {/* 对齐方式 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('justifyLeft')}
            title="左对齐"
          >
            ⬅
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('justifyCenter')}
            title="居中对齐"
          >
            ⬌
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('justifyRight')}
            title="右对齐"
          >
            ➡
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        {/* 列表 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('insertUnorderedList')}
            title="无序列表"
          >
            • 列表
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('insertOrderedList')}
            title="有序列表"
          >
            1. 列表
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        {/* 插入元素 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={insertLink}
            title="插入链接"
          >
            🔗
          </button>
          <button 
            className="toolbar-btn" 
            onClick={insertImage}
            title="插入图片"
          >
            📷
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => execCommand('insertHorizontalRule')}
            title="插入分隔线"
          >
            ───
          </button>
        </div>
        
        <div className="toolbar-divider" />
        
        {/* 其他操作 */}
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={clearFormat}
            title="清除格式"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* 编辑区域 */}
      <div 
        className="editor-content"
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        placeholder={placeholder}
        style={{
          minHeight: config.minHeight || '300px',
          fontSize: config.fontSize || '16px',
          lineHeight: config.lineHeight || '1.6'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <style jsx>{`
        .rich-editor-container {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        
        .editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 8px;
          background: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
          gap: 4px;
        }
        
        .toolbar-group {
          display: flex;
          gap: 2px;
        }
        
        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: #e0e0e0;
          margin: 0 4px;
        }
        
        .toolbar-btn {
          padding: 4px 8px;
          border: 1px solid transparent;
          background: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .toolbar-btn:hover {
          background: white;
          border-color: #d0d0d0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .toolbar-btn:active {
          background: #e8e8e8;
        }
        
        .editor-content {
          padding: 16px;
          outline: none;
          min-height: 300px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .editor-content[contenteditable="true"]:empty:before {
          content: attr(placeholder);
          color: #999;
          pointer-events: none;
        }
        
        .editor-content h1 {
          font-size: 2em;
          margin: 0.67em 0;
          font-weight: bold;
        }
        
        .editor-content h2 {
          font-size: 1.5em;
          margin: 0.83em 0;
          font-weight: bold;
        }
        
        .editor-content p {
          margin: 1em 0;
        }
        
        .editor-content img {
          max-width: 100%;
          height: auto;
        }
        
        .editor-content a {
          color: #007AFF;
          text-decoration: underline;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .editor-toolbar {
            padding: 6px;
          }
          
          .toolbar-btn {
            min-width: 28px;
            height: 28px;
            font-size: 12px;
            padding: 2px 6px;
          }
          
          .editor-content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default RichEditor;