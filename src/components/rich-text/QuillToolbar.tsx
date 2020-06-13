import Quill from 'quill';
import useTranslation from '../useTranslation';

const icons = Quill.import('ui/icons');
icons.code =
  '<svg viewBox="0 0 18 18"><path d="M4.71967 3.21967C5.01256 2.92678 5.48744 2.92678 5.78033 3.21967C6.07322 3.51256 6.07322 3.98744 5.78033 4.28033L2.06066 8L5.78033 11.7197C6.07322 12.0126 6.07322 12.4874 5.78033 12.7803C5.48744 13.0732 5.01256 13.0732 4.71967 12.7803L0.46967 8.53033C0.176777 8.23744 0.176777 7.76256 0.46967 7.46967L4.71967 3.21967ZM11.2803 3.21967C10.9874 2.92678 10.5126 2.92678 10.2197 3.21967C9.92678 3.51256 9.92678 3.98744 10.2197 4.28033L13.9393 8L10.2197 11.7197C9.92678 12.0126 9.92678 12.4874 10.2197 12.7803C10.5126 13.0732 10.9874 13.0732 11.2803 12.7803L15.5303 8.53033C15.8232 8.23744 15.8232 7.76256 15.5303 7.46967L11.2803 3.21967Z"></path></svg>';

interface QuillToolbarProps {
  id?: string;
}

const QuillToolbar = ({ id }: QuillToolbarProps) => {
  const translate = useTranslation();
  const toolbarId = id ? `toolbar-${id}` : 'toolbar';

  return (
    <div id={toolbarId}>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-bold"
          aria-label={translate('formatting_bold')}
          title={translate('formatting_bold')}
        />
        <button
          type="button"
          className="ql-italic"
          aria-label={translate('formatting_italic')}
          title={translate('formatting_italic')}
        />
        <button
          type="button"
          className="ql-underline"
          aria-label={translate('formatting_underline')}
          title={translate('formatting_underline')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-header"
          value="1"
          aria-label={translate('formatting_header')}
          title={translate('formatting_header')}
        />
        <button
          type="button"
          className="ql-blockquote"
          aria-label={translate('formatting_quote')}
          title={translate('formatting_quote')}
        />
        <button
          type="button"
          className="ql-code-block"
          aria-label={translate('formatting_code_multiline')}
          title={translate('formatting_code_multiline')}
        />
        <button
          type="button"
          className="ql-code"
          aria-label={translate('formatting_code_inline')}
          title={translate('formatting_code_inline')}
        />
        <button
          type="button"
          className="ql-script"
          value="sub"
          aria-label={translate('formatting_subscript')}
          title={translate('formatting_subscript')}
        />
        <button
          type="button"
          className="ql-script"
          value="super"
          aria-label={translate('formatting_superscript')}
          title={translate('formatting_superscript')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-list"
          value="ordered"
          aria-label={translate('formatting_ol')}
          title={translate('formatting_ol')}
        />
        <button
          type="button"
          className="ql-list"
          value="bullet"
          aria-label={translate('formatting_ul')}
          title={translate('formatting_ul')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-link"
          aria-label={translate('formatting_link')}
          title={translate('formatting_link')}
        />
        <button
          type="button"
          className="ql-image"
          aria-label={translate('formatting_image')}
          title={translate('formatting_image')}
        />
        <button
          type="button"
          className="ql-video"
          aria-label={translate('video')}
          title={translate('video')}
        />
      </span>
      <span className="ql-formats">
        <button
          type="button"
          className="ql-clean"
          aria-label={translate('formatting_clean')}
          title={translate('formatting_clean')}
        />
      </span>
    </div>
  );
};

export default QuillToolbar;
