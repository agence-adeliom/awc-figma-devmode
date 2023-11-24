const defaultFormatting = {
  prefix: '',
  commentStyle: 'long',
  indentation: '',
  separator: ' =',
  suffix: ';'
}

const createPropertyFormatter = ({outputReferences, dictionary, format, formatting={}}) => {
  let {prefix, commentStyle, indentation, separator, suffix} = Object.assign({}, defaultFormatting, formatting);

  switch(format) {
    case 'css':
      prefix = '--';
      indentation = '  ';
      separator = ':';
      break;
    case 'sass':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'less':
      prefix = '@';
      commentStyle = 'short';
      indentation = '';
      separator = ':';
      break;
    case 'stylus':
      prefix = '$';
      commentStyle = 'short';
      indentation = '';
      separator = '=';
      break;
  }

  return function(prop) {
    let to_ret_prop = `${indentation}${prefix}${prop.name}${separator}`.replace('--dark-', '--').replace('--light-', '--');
    let value = prop.value;


    if (outputReferences && dictionary.usesReference(prop.original.value)) {
      if (typeof value === 'string') {
        const refs = dictionary.getReferences(prop.original.value);
        refs.forEach(ref => {
          if (ref.value && ref.name) {
            value = value.replace(ref.value, function() {
              if (format === 'css') {
                return `var(${prefix}${ref.name})`
              } else {
                return `${prefix}${ref.name}`;
              }
            });
          }
        });
      }
    }

    to_ret_prop += prop.attributes.category === 'asset' ? `"${value}"` : value;

    if (format == 'sass' && prop.themeable === true) {
      to_ret_prop += ' !default';
    }

    to_ret_prop += suffix;

    if (prop.comment && commentStyle !== 'none') {
      if (commentStyle === 'short') {
        to_ret_prop = to_ret_prop.concat(` // ${prop.comment}`);
      } else {
        to_ret_prop = to_ret_prop.concat(` /* ${prop.comment} */`);
      }
    }

    return to_ret_prop;
  }
}

export default createPropertyFormatter;
