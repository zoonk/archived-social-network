import { useContext } from 'react';
import { GlobalContext } from '@zoonk/utils';

const QuillToolbar = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <div id="toolbar">
      <span className="ql-formats">
        <button
          type="button"
          className="ql-bold"
          aria-label={translate('formatting_bold')}
        />
        <button
          type="button"
          className="ql-italic"
          aria-label={translate('formatting_italic')}
        />
        <button
          type="button"
          className="ql-underline"
          aria-label={translate('formatting_underline')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-header"
          value="1"
          aria-label={translate('formatting_header')}
        />
        <button
          type="button"
          className="ql-blockquote"
          aria-label={translate('formatting_quote')}
        />
        <button
          type="button"
          className="ql-code-block"
          aria-label={translate('formatting_code_multiline')}
        />
        <button
          type="button"
          className="ql-script"
          value="sub"
          aria-label={translate('formatting_subscript')}
        />
        <button
          type="button"
          className="ql-script"
          value="super"
          aria-label={translate('formatting_superscript')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-list"
          value="ordered"
          aria-label={translate('formatting_ol')}
        />
        <button
          type="button"
          className="ql-list"
          value="bullet"
          aria-label={translate('formatting_ul')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-link"
          aria-label={translate('formatting_link')}
        />
        <button
          type="button"
          className="ql-image"
          aria-label={translate('formatting_image')}
        />
        <button
          type="button"
          className="ql-video"
          aria-label={translate('video')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-clean"
          aria-label={translate('formatting_clean')}
        />
      </span>
    </div>
  );
};

export default QuillToolbar;
